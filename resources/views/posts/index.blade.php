<x-app-layout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header & Sorting -->
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h1 class="text-3xl font-bold text-white">Explore Media</h1>
            
            <div class="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
                <a href="{{ route('posts.index', ['sort' => 'newest']) }}" 
                   class="px-4 py-2 rounded-lg text-sm font-medium transition-all {{ $sort === 'newest' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200' }}">
                    Newest
                </a>
                <a href="{{ route('posts.index', ['sort' => 'most_viewed']) }}" 
                   class="px-4 py-2 rounded-lg text-sm font-medium transition-all {{ $sort === 'most_viewed' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200' }}">
                    Most Viewed
                </a>
                <a href="{{ route('posts.index', ['sort' => 'popular']) }}" 
                   class="px-4 py-2 rounded-lg text-sm font-medium transition-all {{ $sort === 'popular' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200' }}">
                    Popular
                </a>
            </div>
        </div>

        <!-- Media Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @forelse($posts as $post)
                <div class="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1">
                    <a href="{{ route('posts.show', $post) }}" class="block relative aspect-square overflow-hidden">
                        @if($post->type === 'image')
                            <img src="{{ Storage::url($post->file_path) }}" alt="{{ $post->title }}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                        @else
                            <div class="w-full h-full bg-slate-950 flex items-center justify-center relative">
                                <video src="{{ Storage::url($post->file_path) }}" class="w-full h-full object-cover"></video>
                                <div class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                                    <svg class="w-12 h-12 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z"/>
                                    </svg>
                                </div>
                            </div>
                        @endif
                        
                        <!-- Overlay info -->
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                            <div class="flex items-center gap-4 text-white text-sm font-semibold">
                                <span class="flex items-center gap-1">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/></svg>
                                    {{ $post->likes_count }}
                                </span>
                                <span class="flex items-center gap-1">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/></svg>
                                    {{ $post->comments_count }}
                                </span>
                            </div>
                        </div>
                    </a>

                    <div class="p-4">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                                {{ substr($post->user->name, 0, 1) }}
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-semibold text-slate-200 truncate">{{ $post->title }}</p>
                                <p class="text-xs text-slate-500 truncate">by {{ $post->user->name }}</p>
                            </div>
                        </div>
                        
                        <div class="flex flex-wrap gap-2">
                            @foreach($post->tags->take(2) as $tag)
                                <span class="text-[10px] uppercase tracking-wider font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-md">
                                    #{{ $tag->name }}
                                </span>
                            @endforeach
                        </div>
                    </div>
                </div>
            @empty
                <div class="col-span-full py-20 text-center">
                    <div class="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 border border-slate-800">
                        <svg class="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-slate-300">No media found</h3>
                    <p class="text-slate-500 mt-2">Be the first to share something amazing!</p>
                    <a href="{{ route('posts.create') }}" class="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
                        Upload Media
                    </a>
                </div>
            @endforelse
        </div>

        <!-- Pagination -->
        <div class="mt-12">
            {{ $posts->links() }}
        </div>
    </div>
</x-app-layout>
