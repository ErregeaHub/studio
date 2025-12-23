<x-app-layout>
    <div class="max-w-2xl mx-auto">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
            <h1 class="text-2xl font-bold text-white mb-6">Share New Media</h1>
            
            <form action="{{ route('posts.store') }}" method="POST" enctype="multipart/form-data">
                @csrf
                
                <div class="space-y-6">
                    <div>
                        <label for="title" class="block text-sm font-medium text-slate-300 mb-2">Title</label>
                        <input type="text" name="title" id="title" required
                               class="w-full bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:ring-blue-500 focus:border-blue-500 p-3">
                        @error('title') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>

                    <div>
                        <label for="description" class="block text-sm font-medium text-slate-300 mb-2">Description</label>
                        <textarea name="description" id="description" rows="4"
                                  class="w-full bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:ring-blue-500 focus:border-blue-500 p-3"></textarea>
                        @error('description') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label for="type" class="block text-sm font-medium text-slate-300 mb-2">Media Type</label>
                            <select name="type" id="type" required
                                    class="w-full bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:ring-blue-500 focus:border-blue-500 p-3">
                                <option value="image">Image</option>
                                <option value="video">Video</option>
                            </select>
                        </div>
                        <div>
                            <label for="category_id" class="block text-sm font-medium text-slate-300 mb-2">Category</label>
                            <select name="category_id" id="category_id" required
                                    class="w-full bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:ring-blue-500 focus:border-blue-500 p-3">
                                @foreach($categories as $category)
                                    <option value="{{ $category->id }}">{{ $category->name }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>

                    <div>
                        <label for="file" class="block text-sm font-medium text-slate-300 mb-2">Media File (Max: 20MB for Video, 5MB for Image)</label>
                        <input type="file" name="file" id="file" required
                               class="w-full bg-slate-950 border border-slate-800 rounded-xl text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 p-3">
                        @error('file') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>

                    <div>
                        <label for="tags" class="block text-sm font-medium text-slate-300 mb-2">Tags (Comma separated)</label>
                        <input type="text" name="tags" id="tags" placeholder="nature, travel, cinematic"
                               class="w-full bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:ring-blue-500 focus:border-blue-500 p-3">
                    </div>

                    <div class="pt-4">
                        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20">
                            Upload & Publish
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</x-app-layout>
