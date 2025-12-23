<x-app-layout>
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col lg:flex-row gap-8">
            <!-- Left Side: Media -->
            <div class="flex-1">
                <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                    @if($post->type === 'image')
                        <img src="{{ Storage::url($post->file_path) }}" alt="{{ $post->title }}" class="w-full h-auto">
                    @else
                        <video src="{{ Storage::url($post->file_path) }}" controls class="w-full h-auto bg-black"></video>
                    @endif
                    
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-6">
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold text-white uppercase">
                                    {{ substr($post->user->name, 0, 1) }}
                                </div>
                                <div>
                                    <h1 class="text-xl font-bold text-white">{{ $post->title }}</h1>
                                    <p class="text-slate-400 text-sm">Shared by <span class="text-blue-500 font-semibold">{{ $post->user->name }}</span> • {{ $post->created_at->diffForHumans() }}</p>
                                </div>
                            </div>
                            
                            <div class="flex items-center gap-3">
                                <button id="like-btn" data-post-id="{{ $post->id }}" 
                                        class="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors group">
                                    <svg id="like-icon" class="w-6 h-6 text-slate-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                    </svg>
                                    <span id="likes-count" class="text-slate-300 font-medium">{{ $post->likes_count }}</span>
                                </button>
                                
                                <div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium">
                                    <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                    </svg>
                                    {{ $post->views_count }}
                                </div>
                            </div>
                        </div>

                        <div class="prose prose-invert max-w-none text-slate-300 mb-6">
                            {{ $post->description }}
                        </div>

                        <div class="flex flex-wrap gap-2">
                            @foreach($post->tags as $tag)
                                <a href="#" class="text-xs uppercase tracking-wider font-bold text-blue-500 bg-blue-500/10 px-3 py-1 rounded-lg hover:bg-blue-500/20 transition-colors">
                                    #{{ $tag->name }}
                                </a>
                            @endforeach
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Side: Comments -->
            <div class="w-full lg:w-96">
                <div class="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[600px] shadow-xl">
                    <div class="p-4 border-b border-slate-800">
                        <h2 class="font-bold text-white flex items-center gap-2">
                            Comments
                            <span id="comments-count-badge" class="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">{{ $post->comments_count }}</span>
                        </h2>
                    </div>

                    <div id="comments-container" class="flex-1 overflow-y-auto p-4 space-y-4">
                        @forelse($post->comments as $comment)
                            <div class="space-y-4" id="comment-{{ $comment->id }}">
                                <div class="flex gap-3">
                                    <div class="w-8 h-8 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase">
                                        {{ substr($comment->user->name, 0, 1) }}
                                    </div>
                                    <div class="flex-1">
                                        <div class="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2">
                                            <p class="text-xs font-bold text-blue-500 mb-1">{{ $comment->user->name }}</p>
                                            <p class="text-sm text-slate-300">{{ $comment->content }}</p>
                                        </div>
                                        <div class="flex items-center gap-4 mt-1 ml-2">
                                            <p class="text-[10px] text-slate-500">{{ $comment->created_at->diffForHumans() }}</p>
                                            @auth
                                                <button onclick="showReplyForm({{ $comment->id }}, '{{ $comment->user->name }}')" class="text-[10px] font-bold text-slate-400 hover:text-blue-500 transition-colors">Reply</button>
                                            @endauth
                                        </div>
                                    </div>
                                </div>

                                <!-- Replies -->
                                <div class="ml-10 space-y-4" id="replies-{{ $comment->id }}">
                                    @foreach($comment->replies as $reply)
                                        <div class="flex gap-3">
                                            <div class="w-6 h-6 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center text-[8px] font-bold text-slate-400 uppercase">
                                                {{ substr($reply->user->name, 0, 1) }}
                                            </div>
                                            <div class="flex-1">
                                                <div class="bg-slate-950 border border-slate-800 rounded-2xl px-3 py-1.5">
                                                    <p class="text-[10px] font-bold text-blue-500 mb-0.5">{{ $reply->user->name }}</p>
                                                    <p class="text-xs text-slate-300">{{ $reply->content }}</p>
                                                </div>
                                                <p class="text-[9px] text-slate-500 mt-0.5 ml-2">{{ $reply->created_at->diffForHumans() }}</p>
                                            </div>
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                        @empty
                            <div id="no-comments" class="text-center py-10">
                                <p class="text-slate-500 text-sm">No comments yet. Start the conversation!</p>
                            </div>
                        @endforelse
                    </div>

                    <div class="p-4 border-t border-slate-800 bg-slate-900/50">
                        @auth
                            <div id="reply-info" class="hidden mb-2 flex items-center justify-between bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
                                <p class="text-xs text-blue-400">Replying to <span id="reply-user" class="font-bold"></span></p>
                                <button onclick="cancelReply()" class="text-blue-400 hover:text-blue-300">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                </button>
                            </div>
                            <form id="comment-form" action="{{ route('posts.comment', $post) }}" method="POST">
                                @csrf
                                <input type="hidden" name="parent_id" id="parent-id-input">
                                <div class="relative">
                                    <textarea name="content" id="comment-content" rows="1" placeholder="Write a comment..." 
                                              class="w-full bg-slate-950 border border-slate-800 rounded-xl text-slate-300 text-sm focus:ring-blue-500 focus:border-blue-500 pr-12 p-3 resize-none"></textarea>
                                    <button type="submit" class="absolute right-2 top-2 p-1.5 text-blue-500 hover:text-blue-400 transition-colors">
                                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>
                                    </button>
                                </div>
                            </form>
                        @else
                            <div class="text-center py-2">
                                <p class="text-xs text-slate-500">Please <a href="{{ route('login') }}" class="text-blue-500 hover:underline">login</a> to comment</p>
                            </div>
                        @endauth
                    </div>
                </div>
            </div>
        </div>
    </div>

    @push('scripts')
    <script>
        function showReplyForm(commentId, userName) {
            document.getElementById('parent-id-input').value = commentId;
            document.getElementById('reply-user').textContent = userName;
            document.getElementById('reply-info').classList.remove('hidden');
            document.getElementById('comment-content').focus();
        }

        function cancelReply() {
            document.getElementById('parent-id-input').value = '';
            document.getElementById('reply-info').classList.add('hidden');
        }

        document.addEventListener('DOMContentLoaded', function() {
            const likeBtn = document.getElementById('like-btn');
            const commentForm = document.getElementById('comment-form');

            if (likeBtn) {
                likeBtn.addEventListener('click', async function() {
                    const postId = this.dataset.postId;
                    try {
                        const response = await fetch(`/posts/${postId}/like`, {
                            method: 'POST',
                            headers: {
                                'X-CSRF-TOKEN': '{{ csrf_token() }}',
                                'Accept': 'application/json'
                            }
                        });
                        const data = await response.json();
                        document.getElementById('likes-count').textContent = data.likes_count;
                        const icon = document.getElementById('like-icon');
                        if (data.status === 'liked') {
                            icon.classList.add('fill-red-500', 'text-red-500');
                            icon.classList.remove('text-slate-400');
                        } else {
                            icon.classList.remove('fill-red-500', 'text-red-500');
                            icon.classList.add('text-slate-400');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                });
            }

            if (commentForm) {
                commentForm.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    const content = document.getElementById('comment-content').value;
                    const parentId = document.getElementById('parent-id-input').value;
                    if (!content.trim()) return;

                    try {
                        const response = await fetch(this.action, {
                            method: 'POST',
                            headers: {
                                'X-CSRF-TOKEN': '{{ csrf_token() }}',
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify({ content, parent_id: parentId })
                        });
                        const data = await response.json();
                        
                        if (data.status === 'success') {
                            if (data.comment.parent_id) {
                                // Add to replies
                                const repliesContainer = document.getElementById(`replies-${data.comment.parent_id}`);
                                const replyHtml = `
                                    <div class="flex gap-3 animate-fade-in">
                                        <div class="w-6 h-6 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center text-[8px] font-bold text-slate-400 uppercase">
                                            ${data.comment.user_name.substring(0, 1)}
                                        </div>
                                        <div class="flex-1">
                                            <div class="bg-slate-950 border border-slate-800 rounded-2xl px-3 py-1.5">
                                                <p class="text-[10px] font-bold text-blue-500 mb-0.5">${data.comment.user_name}</p>
                                                <p class="text-xs text-slate-300">${data.comment.content}</p>
                                            </div>
                                            <p class="text-[9px] text-slate-500 mt-0.5 ml-2">${data.comment.created_at}</p>
                                        </div>
                                    </div>
                                `;
                                repliesContainer.insertAdjacentHTML('beforeend', replyHtml);
                            } else {
                                // Add to main comments
                                const container = document.getElementById('comments-container');
                                const noComments = document.getElementById('no-comments');
                                if (noComments) noComments.remove();

                                const commentHtml = `
                                    <div class="space-y-4 animate-fade-in" id="comment-${data.comment.id}">
                                        <div class="flex gap-3">
                                            <div class="w-8 h-8 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase">
                                                ${data.comment.user_name.substring(0, 1)}
                                            </div>
                                            <div class="flex-1">
                                                <div class="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2">
                                                    <p class="text-xs font-bold text-blue-500 mb-1">${data.comment.user_name}</p>
                                                    <p class="text-sm text-slate-300">${data.comment.content}</p>
                                                </div>
                                                <div class="flex items-center gap-4 mt-1 ml-2">
                                                    <p class="text-[10px] text-slate-500">${data.comment.created_at}</p>
                                                    <button onclick="showReplyForm(${data.comment.id}, '${data.comment.user_name}')" class="text-[10px] font-bold text-slate-400 hover:text-blue-500 transition-colors">Reply</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="ml-10 space-y-4" id="replies-${data.comment.id}"></div>
                                    </div>
                                `;
                                container.insertAdjacentHTML('afterbegin', commentHtml);
                            }
                            
                            document.getElementById('comment-content').value = '';
                            document.getElementById('comments-count-badge').textContent = data.comments_count;
                            cancelReply();
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                });
            }
        });
    </script>
    <style>
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fadeIn 0.3s ease-out forwards;
        }
    </style>
    @endpush
</x-app-layout>
