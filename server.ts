import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini client
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Gemini client initialized successfully server-side.');
  } catch (error) {
    console.error('Failed to initialize server-side GoogleGenAI client:', error);
  }
} else {
  console.log('Gemini API key is not configured or uses placeholder. Running with offline fallback mode.');
}

// Server-side LLM endpoint
app.post('/api/ai-insights', async (req, res) => {
  const { profile, physiology } = req.body;

  if (!profile || !physiology) {
    res.status(400).json({ error: 'Missing physical measurements data' });
    return;
  }

  // If Gemini is not set up, the client-side fetch failing is handled but we can also return our high-quality fallback right here from the backend!
  if (!ai) {
    // Return robust curated insights
    const isFatLoss = profile.goals.goalType === 'Fat Loss';
    const isMuscle = profile.goals.goalType === 'Muscle Gain';
    
    res.json({
      workout: isFatLoss
        ? `Perform 3 high-intensity strength resistance days (focusing on compound chest, back, and leg sequences) paired with 2 weekly cardio sessions at a target heart rate of ${Math.round(180 - profile.age * 0.7)} bpm to preserve lean tissue and maximize metabolic burn rate.`
        : isMuscle
        ? `Train on a 4-day Upper/Lower split, prioritizing 8-12 reps per set to fail, with a 2.5% load progression weekly. Target 70-80% 1RM limit on squats, deadlifts, and overhead presses.`
        : `Engage in 3 Full Body functional fitness days using mixed barbell, kettlebell, and bodyweight elements. Introduce 1 HIIT cycle for metabolic adaptation.`,
      
      nutrition: isFatLoss
        ? `Aim for ${physiology.recommendedCalories} kcal daily (a safe 500 kcal deficit). Consume ${physiology.proteinGrams}g Protein to fuel muscle, limit simple sugars, and stay hydrated with ${physiology.waterIntakeLiters}L water to satisfy satiety levels.`
        : isMuscle
        ? `Maintain a surplus of ${physiology.recommendedCalories} kcal with ${physiology.proteinGrams}g Protein daily. Ensure plenty of complex carbs (${physiology.carbsGrams}g) pre and post training to fully replenish glycogen stores.`
        : `Eat at a maintenance rate of ${physiology.recommendedCalories} kcal. Focus on natural micro-nutrients, clean healthy fats (${physiology.fatGrams}g), and lean protein sources.`,

      recovery: `Ensure a strict rest sequence between high stress days. Complete your nighttime protocol to secure ${physiology.sleepTargetHours} hours of deep recuperative sleep, encouraging high-volume muscular tissue rebuilding and lowering blood cortisol levels.`,
      
      motivation: `Streak: You are currently on a ${profile.workoutDays?.length > 2 ? 'strong 4-day' : 'great'} streak! Progress is an accumulation of micro-habits rather than sudden shifts. Forge onwards, Tiru!`,
      
      healthScoreInsight: `Your structural biometrics report a BMI of ${physiology.bmi} (Zone: ${physiology.bmi > 25 ? 'Overweight margin' : 'Optimal representation'}). Increasing cardiorespiratory consistency can further heighten overall cellular delivery.`,
    });
    return;
  }

  try {
    const prompt = `You are the premium AI Head Coach at FitForge AI, designed with the training philosophies of professional athletes and sports nutritionists.
Calculate a fitness direction back for our user based on this physical data:
- Name: ${profile.fullName}
- Age: ${profile.age}
- Gender: ${profile.gender}
- Goal: ${profile.goals.goalType} (Target Weight: ${profile.goals.targetWeight}${profile.goals.targetWeightUnit}, Current: ${profile.measurements.weight}${profile.measurements.weightUnit})
- Height: ${profile.measurements.height}${profile.measurements.heightUnit}
- Activity Level: ${profile.activityLevel}
- Diet Selection: ${profile.dietType} (Allergies: ${profile.allergies.join(', ') || 'None'})
- Gym Access: ${profile.hasGymAccess ? 'Yes' : 'No'} (Fitness Level: ${profile.fitnessLevel || 'Beginner'}, Days Available: ${profile.workoutDays.join(', ')})

Precalculated Physiology Details:
- BMI: ${physiology.bmi} (Target BMI: ${physiology.targetBmi})
- BMR: ${physiology.bmr} kcal
- TDEE: ${physiology.tdee} kcal
- Target Calories: ${physiology.recommendedCalories} kcal
- Target Water: ${physiology.waterIntakeLiters} Liters
- Sleep Goal: ${physiology.sleepTargetHours} Hours
- Macros split: ${physiology.proteinGrams}g Protein, ${physiology.carbsGrams}g Carbs, ${physiology.fatGrams}g Fat

Please generate professional, action-oriented, hyper-personalized, and scientifically valid advice. Avoid generic health talk. Give specific parameters. Make your output fit the JSON schema specified.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are the expert athletic algorithm of FitForge AI. Speak directly, objectively, and encouragingly. Use precise training descriptors. Output must be valid JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            workout: {
              type: Type.STRING,
              description: 'Strict professional workout planning recommendation, specifying exercise types, intensity, and days.',
            },
            nutrition: {
              type: Type.STRING,
              description: 'Strict professional nutrition recommendation based on caloric goals and target macros.',
            },
            recovery: {
              type: Type.STRING,
              description: 'Detailed active recovery and sleep strategy.',
            },
            motivation: {
              type: Type.STRING,
              description: 'Ultra-targeted psychological motivation message.',
            },
            healthScoreInsight: {
              type: Type.STRING,
              description: 'Analytical assessment of their BMI, metabolic rate, and progress health indicators.',
            },
          },
          required: ['workout', 'nutrition', 'recovery', 'motivation', 'healthScoreInsight'],
        },
      },
    });

    const parsedData = JSON.parse(response.text?.trim() || '{}');
    res.json(parsedData);
  } catch (error) {
    console.error('Error generating Gemini content:', error);
    res.status(500).json({ error: 'Failed to query FitForge AI Engine.' });
  }
});

// Server-side Workout Generator
app.post('/api/ai-workout-generator', async (req, res) => {
  const { goal, age, weight, height, fitnessLevel, availableEquipment, splitType } = req.body;
  
  if (!goal || !fitnessLevel) {
    res.status(400).json({ error: 'Missing fitness goals and levels parameters' });
    return;
  }

  if (!ai) {
    res.json({
      title: `${fitnessLevel || 'Intermediate'} ${splitType || 'Push Pull Legs'} Routine`,
      description: `Targeting professional-grade ${goal || 'Athletic Performance'} using ${availableEquipment || 'Full Gym'}.`,
      schedule: [
        { day: 'Day 1: Chest & Shoulders (Push A)', exercises: [{ name: 'Incline Bench Press', sets: 4, reps: 8, weight: '70% 1RM' }, { name: 'Seated Dumbbell Shoulder Press', sets: 3, reps: 10, weight: 'Moderate' }, { name: 'Cable Lateral Raises', sets: 4, reps: 15, weight: 'Focused Squeeze' }] },
        { day: 'Day 2: Back & Biceps (Pull A)', exercises: [{ name: 'Barbell Deadlifts', sets: 3, reps: 5, weight: '80% 1RM' }, { name: 'Weighted Pull-Ups', sets: 4, reps: 6, weight: 'Body + 10kg' }, { name: 'Incline Dumbbell Hammer Curls', sets: 3, reps: 12, weight: 'Moderate' }] },
        { day: 'Day 3: Quads, Hamstrings & Calves (Legs A)', exercises: [{ name: 'Barbell Back Squats', sets: 4, reps: 6, weight: '75% 1RM' }, { name: 'Romanian Deadlifts', sets: 4, reps: 10, weight: 'Heavy' }, { name: 'Standing Calf Raises', sets: 4, reps: 15, weight: 'Squeeze' }] },
        { day: 'Day 4: Rest & Mobility', exercises: [{ name: 'Active Recovery Walk', sets: 1, reps: 30, weight: '3.5 km' }, { name: 'Dynamic Joint Mobility Protocols', sets: 1, reps: 20, weight: 'Bodyweight' }] },
        { day: 'Day 5: Arms & Shoulders (Push B)', exercises: [{ name: 'Close-Grip Bench Press', sets: 3, reps: 8, weight: 'Controlled' }, { name: 'Dips (Weighted)', sets: 3, reps: 8, weight: '+15kg' }, { name: 'Dumbbell Lateral Raises', sets: 4, reps: 12, weight: 'Light-Moderate' }] },
        { day: 'Day 6: Lower Back & Core (Pull B)', exercises: [{ name: 'Chest-Supported Row', sets: 4, reps: 10, weight: 'Squeeze' }, { name: 'Hanging Leg Raises', sets: 3, reps: 15, weight: 'Body-weight' }, { name: 'Planks', sets: 3, reps: 60, weight: '1 min duration' }] },
        { day: 'Day 7: Full Regeneration Diet Protocol', exercises: [{ name: 'Recovery Breathwork & Active Stretch', sets: 1, reps: 15, weight: 'Deep' }] }
      ]
    });
    return;
  }

  try {
    const prompt = `Generate a scientifically structured workout program weekly schedule for:
- Goal: ${goal}
- Age: ${age}
- Weight: ${weight}
- Height: ${height}
- Fitness Level: ${fitnessLevel}
- Available Equipment: ${availableEquipment}
- Program Split Type: ${splitType || 'Push Pull Legs'}

Provide a finished professional weekly schedule containing Day 1 to Day 7. Return exactly matching the JSON schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are the expert GoldenGym AI coaching algorithm. Speak directly and professionally. Use precise training descriptors. Return valid JSON only.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            schedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  exercises: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        sets: { type: Type.INTEGER },
                        reps: { type: Type.INTEGER },
                        weight: { type: Type.STRING }
                      },
                      required: ['name', 'sets', 'reps', 'weight']
                    }
                  }
                },
                required: ['day', 'exercises']
              }
            }
          },
          required: ['title', 'description', 'schedule']
        }
      }
    });

    const parsedData = JSON.parse(response.text?.trim() || '{}');
    res.json(parsedData);
  } catch (error) {
    console.error('Error generating workout program:', error);
    res.status(550).json({ error: 'AI compilation of physical programming failed.' });
  }
});

// Server-side Diet Planner & Nutrition Coach
app.post('/api/ai-diet-planner', async (req, res) => {
  const { dietPreference, goal, calories, protein, carbs, fats } = req.body;

  if (!ai) {
    res.json({
      title: `${dietPreference || 'Standard High Protein'} Performance Nutrition Plan`,
      caloriesTarget: calories || 2400,
      macros: { protein: protein || 150, carbs: carbs || 220, fats: fats || 70, fiber: 30 },
      dailyMeals: [
        { meal: 'Breakfast', items: '4 Egg Whites, 2 Whole Eggs, 80g Classic Rolled Oats cooked in almond milk, 1 Banana', macros: 'Calories: 590 | P: 46g, C: 62g, F: 17g' },
        { meal: 'Pre Workout Snack', items: '1 Scoop Gold Whey Protein, 1 Large Apple, 5g Micronized Creatine', macros: 'Calories: 215 | P: 26g, C: 26g, F: 2g' },
        { meal: 'Post Workout Meal', items: '160g Grilled Lemon-Herb Chicken Breast, 200g Cooked Jasmine Rice, 100g Steamed Asparagus', macros: 'Calories: 520 | P: 50g, C: 66g, F: 5g' },
        { meal: 'Lunch', items: '150g Stir-fried Tempeh or Lean Turkey, 150g Sweet Potato Mash, Mixed Leafy salad with avocado oil', macros: 'Calories: 490 | P: 36g, C: 46g, F: 13g' },
        { meal: 'Dinner', items: '180g Pan-Seared Salmon or Crispy Glazed Tofu, 100g Ancient Quinoa, Steamed Broccoli', macros: 'Calories: 530 | P: 44g, C: 36g, F: 21g' },
        { meal: 'Snacks / Bedtime', items: '30g Roasted Almonds or Walnut halves, 150g Organic Greek Yogurt', macros: 'Calories: 265 | P: 18g, C: 14g, F: 15g' }
      ],
      shoppingList: [
        'Free-Range Eggs, Fresh Chicken Breast, Salmon fillets (or Tofu/Tempeh slabs)',
        'Classic Rolled Oats, Jasmine Rice, Ancient Quinoa, Sweet Potatoes',
        'Broccoli crowns, Asparagus spears, Mixed leafy greens, Avocado, Bananas, Apples',
        'Organic unsweetened Almond Milk, Greek Yogurt, Roasted Almonds, walnuts',
        'Elite Whey Protein, Micronized Creatine'
      ]
    });
    return;
  }

  try {
    const prompt = `Generate a customized daily/weekly diet meal plan for:
- Preference: ${dietPreference || 'Standard'}
- Goal: ${goal || 'Fitness Maintenance'}
- Target: ${calories || 2000} kcal (${protein || 120}g Protein, ${carbs || 200}g Carbs, ${fats || 60}g Fat)

Provide clean meal breakdown for Breakfast, Pre Workout, Post Workout, Lunch, Dinner, Snacks with accurate nutritional indicators, healthy alternatives, and a complete weekly shopping list. Return matching the JSON schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are the expert GoldenGym AI Sports Nutrition Coach. Speak directly, objectively, and encouragingly. Return valid JSON only.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            caloriesTarget: { type: Type.INTEGER },
            macros: {
              type: Type.OBJECT,
              properties: {
                protein: { type: Type.INTEGER },
                carbs: { type: Type.INTEGER },
                fats: { type: Type.INTEGER },
                fiber: { type: Type.INTEGER }
              },
              required: ['protein', 'carbs', 'fats', 'fiber']
            },
            dailyMeals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  meal: { type: Type.STRING },
                  items: { type: Type.STRING },
                  macros: { type: Type.STRING }
                },
                required: ['meal', 'items', 'macros']
              }
            },
            shoppingList: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['title', 'caloriesTarget', 'macros', 'dailyMeals', 'shoppingList']
        }
      }
    });

    const parsedData = JSON.parse(response.text?.trim() || '{}');
    res.json(parsedData);
  } catch (error) {
    console.error('Error generating smart diet plan:', error);
    res.status(500).json({ error: 'AI layout of meal planning failed.' });
  }
});

// Server-side AI Chatbot
app.post('/api/ai-chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: 'Missing structured messages array' });
    return;
  }

  if (!ai) {
    const lastMsg = messages[messages.length - 1]?.content || '';
    let reply = "Hello! I am your server-side GoldenGym AI Assistant. I'm currently running in high-fidelity backup mode. To sustain elite physical output: ensure progressive resistance loading, hit at least 1.6g of protein per kg of bodyweight, sleep 7-9 hours to clear fatiguing toxins, and stay properly hydrated! Let me know if you would like me to compile specific workout structures or macro guides.";
    
    const term = lastMsg.toLowerCase();
    if (term.includes('diet') || term.includes('nutrition') || term.includes('eat') || term.includes('meal')) {
      reply = "Nutrition Strategy: Prioritize high-quality clean proteins (poultry, eggs, tempeh) as your metabolic foundation. Consume complex starches (oats, sweet potato, jasmine rice) before/after sessions to power up your ATP synthesis, and include clean healthy fats (avocado, olive oil, raw almonds) to optimize your hormone levels.";
    } else if (term.includes('workout') || term.includes('exercise') || term.includes('routine') || term.includes('lift')) {
      reply = "Workout Paradigm: Success relies on progressive resistance overload. Log every load, set, and rep. Focus on compound exercises (squat, deadlift, military press, bench press, chest pull) to prompt whole-body muscle stimulation, keeping high-intensity sessions under 65 minutes.";
    } else if (term.includes('sleep') || term.includes('rest') || term.includes('recovery')) {
      reply = "Physical Recovery: Muscle tissue reconstruction and nervous system cooling take place primarily during deep slow-wave sleep. Limit exposure to screen blue-light 1 hour prior to sleep, and aim for a strict 7.5 to 9 hour window of dark, cool resting hours.";
    }

    res.json({ reply });
    return;
  }

  try {
    const formattedHistory = messages.slice(0, -1).map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));
    const lastMessage = messages[messages.length - 1].content;

    const chat = ai.chats.create({
      model: 'gemini-3.5-flash',
      history: formattedHistory,
      config: {
        systemInstruction: 'You are GoldenGym AI Coach, an expert athletic trainer, elite sports nutritionist, and professional gym supervisor. Provide highly actionable, concise, scientific, and clear guidance. Do not use generic health disclaimers. Avoid slop.'
      }
    });

    const result = await chat.sendMessage({ message: lastMessage });
    res.json({ reply: result.text || 'I have securely integrated your metrics inside my program.' });
  } catch (error) {
    console.error('Error conducting AI Chat processing:', error);
    res.status(500).json({ reply: 'Under backup protocols, let me suggest focusing on progressive intensity, high hydration, and strict nocturnal recovery hours!' });
  }
});

// Configure Vite middleware or Static asset paths
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted for local environment.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FitForge AI backend running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
