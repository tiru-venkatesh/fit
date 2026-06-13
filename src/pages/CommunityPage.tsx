import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles, MessageSquare, ThumbsUp, Plus, Users, Heart, Share2, Eye, Filter
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { MobileSidebar } from '../components/MobileSidebar';
import { GlassCard } from '../components/GlassCard';
import { useToast } from '../components/ToastProvider';

interface Post {
  id: string;
  author: string;
  avatar: string;
  role: string;
  group: string;
  content: string;
  likes: number;
  liked: boolean;
  comments: { author: string; content: string }[];
  date: string;
}

export default function CommunityPage() {
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string>('All');

  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Ananya Sharma',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
      role: 'Member Pro',
      group: 'Fat Loss Warriors',
      content: 'Just committed to the GoldenGym 30-Day Fat Loss challenge! Already logged 3.1 Liters of water and completed my morning cardio burst. Who is entering with me? Let’s stay intense together!',
      likes: 24,
      liked: false,
      comments: [
        { author: 'Vikram Singh', content: 'Count me in! Entering today in the hypertrophy block.' },
        { author: 'Deshmukh R.', content: 'Perfect consistency. Let’s hit those targets!' }
      ],
      date: '2 hours ago'
    },
    {
      id: '2',
      author: 'Coach Vikram Singh',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
      role: 'Master Coach',
      group: 'Strength Hypertrophy',
      content: 'Quick tip: When performing squats or chest presses, lock your scapula down and target the centric phase for 3 slow seconds. Micro muscle fiber expansion peaks during controlled eccentricity. Track your sets!',
      likes: 42,
      liked: true,
      comments: [
        { author: 'Tiru Venkatesh', content: 'Excellent advice. Noticed immediate stability improvements doing this!' }
      ],
      date: '5 hours ago'
    },
    {
      id: '3',
      author: 'Priya Patel',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
      role: 'Member Elite',
      group: 'Hydration Elite',
      content: 'My sleep recovery score hit 96% last night under cool room conditions. Circadian alignment is the ultimate recovery fuel. Highly suggest turning off blue-light screens 1 hour before bed!',
      likes: 18,
      liked: false,
      comments: [],
      date: '1 day ago'
    }
  ]);

  // Form State for creating a new post
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostGroup, setNewPostGroup] = useState('Fat Loss Warriors');
  const [commentInput, setCommentInput] = useState<{ [postId: string]: string }>({});

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const created: Post = {
      id: Math.random().toString(),
      author: 'Tiru Venkatesh (You)',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60',
      role: 'Elite Athlete',
      group: newPostGroup,
      content: newPostContent,
      likes: 0,
      liked: false,
      comments: [],
      date: 'Just now'
    };

    setPosts([created, ...posts]);
    setNewPostContent('');
    toast('Community update posted successfully!', 'success');
  };

  const handleLikePost = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            liked: !p.liked,
            likes: p.liked ? p.likes - 1 : p.likes + 1
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string) => {
    const text = commentInput[postId];
    if (!text || !text.trim()) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, { author: 'Tiru Venkatesh (You)', content: text }]
          };
        }
        return p;
      })
    );

    setCommentInput((prev) => ({ ...prev, [postId]: '' }));
    toast('Comment added successfully!', 'success');
  };

  // Groups list
  const groupsList = ['All', 'Fat Loss Warriors', 'Strength Hypertrophy', 'Hydration Elite'];

  // Filter posts
  const filteredPosts = activeGroup === 'All' ? posts : posts.filter(p => p.group === activeGroup);

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col justify-between">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-grow flex">
        <Sidebar />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 md:pl-72 animate-fade-in duration-300">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Page Header */}
            <div className="border-b border-white/[0.04] pb-6">
              <span className="text-[10px] uppercase font-black text-orange-500 tracking-widest flex items-center gap-1.5">
                <Users className="h-4 w-4" /> SHARED COMMUNITY ENCLAVE
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1 uppercase font-sans">Athletes Community Center</h1>
              <p className="text-xs text-zinc-500 mt-1 font-medium font-sans">Discuss metabolic programming, suggest healthy snack replacements, and benchmark joint mobility sets with regional athletes.</p>
            </div>

            {/* Main Grid: left posts pipeline, right groups list selection */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Filter controls & Creator form & feed */}
              <div className="md:col-span-8 space-y-6">
                
                {/* Creator Form */}
                <GlassCard className="p-5 border border-white/[0.04]">
                  <form onSubmit={handleCreatePost} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60" alt="avatar" className="h-8 w-8 rounded-full border border-white/10" referrerPolicy="no-referrer" />
                      <div className="flex-grow">
                        <span className="text-[10px] text-zinc-400 font-extrabold uppercase block leading-none">Share an update</span>
                        <span className="text-[8px] text-orange-400 font-bold uppercase tracking-widest">Tiru Venkatesh (You)</span>
                      </div>
                    </div>

                    <textarea
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="Share your macro achievements, streak highlights, or muscle pumps..."
                      rows={3}
                      className="w-full rounded-xl bg-zinc-950 border border-white/10 p-3 text-xs font-bold text-white outline-none focus:border-orange-500 resize-none"
                    />

                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-zinc-500 uppercase">Target Hub:</span>
                        <select
                          value={newPostGroup}
                          onChange={(e) => setNewPostGroup(e.target.value)}
                          className="rounded-lg bg-zinc-950 border border-white/10 px-2 py-1.5 text-[10px] font-bold text-white outline-none focus:border-orange-500"
                        >
                          <option value="Fat Loss Warriors">Fat Loss Warriors</option>
                          <option value="Strength Hypertrophy">Strength Hypertrophy</option>
                          <option value="Hydration Elite">Hydration Elite</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={!newPostContent.trim()}
                        className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/20 text-[10px] font-black uppercase tracking-wider text-white rounded-xl transition-all cursor-pointer"
                      >
                        Publish Post
                      </button>
                    </div>
                  </form>
                </GlassCard>

                {/* Posts Feed */}
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <GlassCard key={post.id} className="p-5 border border-white/[0.04] space-y-4">
                      {/* Post Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <img src={post.avatar} alt="avatar" className="h-9 w-9 rounded-full border border-white/10 object-cover" referrerPolicy="no-referrer" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-white">{post.author}</span>
                              <span className="text-[8px] font-bold uppercase tracking-widest bg-orange-500/10 border border-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded">
                                {post.role}
                              </span>
                            </div>
                            <span className="text-[9px] text-zinc-500 block font-semibold">{post.date}</span>
                          </div>
                        </div>

                        <span className="text-[9px] font-black uppercase text-zinc-400 bg-zinc-950 border border-white/[0.04] px-2.5 py-1 rounded-full">
                          {post.group}
                        </span>
                      </div>

                      {/* Post Content */}
                      <p className="text-[11px] text-zinc-300 font-medium leading-relaxed font-semibold leading-normal">{post.content}</p>

                      {/* Actions row */}
                      <div className="flex items-center gap-4 pt-2 border-t border-white/[0.02] text-[10px] text-zinc-500 uppercase font-black">
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center gap-1.5 transition-colors ${post.liked ? 'text-orange-500' : 'hover:text-white'}`}
                        >
                          <ThumbsUp className="h-4.5 w-4.5" />
                          <span>{post.likes} Likes</span>
                        </button>
                        
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="h-4.5 w-4.5" />
                          <span>{post.comments.length} Comments</span>
                        </div>
                      </div>

                      {/* Comments block */}
                      {post.comments.length > 0 && (
                        <div className="space-y-2 bg-zinc-950/40 p-3.5 rounded-xl border border-white/[0.01]">
                          {post.comments.map((comm, cIdx) => (
                            <div key={cIdx} className="text-[10px] leading-relaxed border-b border-white/[0.01] last:border-b-0 pb-1.5 last:pb-0">
                              <span className="font-extrabold text-orange-400 uppercase tracking-tight block">{comm.author}:</span>
                              <span className="text-zinc-400 font-semibold">{comm.content}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Comment Input */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={commentInput[post.id] || ''}
                          onChange={(e) => setCommentInput((prev) => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                          className="flex-grow rounded-xl bg-zinc-950 border border-white/5 py-1.5 px-3 text-[10px] font-bold text-white outline-none focus:border-orange-500"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="px-3 bg-zinc-900 border border-white/[0.04] text-[9px] font-bold uppercase rounded-xl hover:bg-zinc-800 transition-colors"
                        >
                          Send
                        </button>
                      </div>

                    </GlassCard>
                  ))}
                </div>

              </div>

              {/* Right Sidebar: Groups filters Selection list */}
              <div className="md:col-span-4 space-y-4">
                <h3 className="text-xs font-black uppercase text-zinc-400 tracking-wider flex items-center gap-2 pl-1">
                  <Filter className="h-4 w-4" /> Categories
                </h3>

                <GlassCard className="p-4 border border-white/[0.04] space-y-2">
                  {groupsList.map((gName) => (
                    <button
                      key={gName}
                      onClick={() => setActiveGroup(gName)}
                      className={`w-full text-left rounded-xl px-4 py-2.5 text-xs font-bold transition-all border block ${
                        activeGroup === gName 
                          ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 font-black' 
                          : 'bg-transparent text-zinc-400 border-transparent hover:text-white'
                      }`}
                    >
                      {gName}
                    </button>
                  ))}
                </GlassCard>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
