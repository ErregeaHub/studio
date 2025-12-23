<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $sort = $request->get('sort', 'newest');
        $query = Post::with(['user', 'category', 'tags'])
            ->withCount(['likes', 'comments']);

        switch ($sort) {
            case 'most_viewed':
                $query->mostViewed();
                break;
            case 'popular':
                $query->popular();
                break;
            case 'newest':
            default:
                $query->newest();
                break;
        }

        $posts = $query->paginate(12);

        return view('posts.index', compact('posts', 'sort'));
    }

    public function create()
    {
        $categories = Category::all();
        return view('posts.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:image,video',
            'category_id' => 'nullable|exists:categories,id',
            'tags' => 'nullable|string',
            'file' => $request->type === 'image' 
                ? 'required|image|max:5120' // 5MB
                : 'required|mimetypes:video/mp4,video/quicktime,video/x-msvideo|max:20480', // 20MB
        ]);

        $path = $request->file('file')->store('posts', 'public');
        
        $post = Post::create([
            'user_id' => auth()->id(),
            'category_id' => $request->category_id,
            'title' => $request->title,
            'description' => $request->description,
            'type' => $request->type,
            'file_path' => $path,
            'views_count' => 0,
        ]);

        if ($request->tags) {
            $tagNames = explode(',', $request->tags);
            $tagIds = [];
            foreach ($tagNames as $name) {
                $name = trim($name);
                if ($name) {
                    $tag = Tag::firstOrCreate(
                        ['slug' => Str::slug($name)],
                        ['name' => $name]
                    );
                    $tagIds[] = $tag->id;
                }
            }
            $post->tags()->sync($tagIds);
        }

        return redirect()->route('posts.show', $post)->with('success', 'Post created successfully!');
    }

    public function show(Post $post)
    {
        $post->increment('views_count');
        $post->load(['user', 'category', 'tags', 'comments' => function($query) {
            $query->whereNull('parent_id')->with(['user', 'replies.user'])->latest();
        }]);
        return view('posts.show', compact('post'));
    }

    public function destroy(Post $post)
    {
        if ($post->user_id !== auth()->id()) {
            abort(403);
        }

        if ($post->file_path) {
            Storage::disk('public')->delete($post->file_path);
        }
        if ($post->thumbnail_path) {
            Storage::disk('public')->delete($post->thumbnail_path);
        }

        $post->delete();

        return redirect()->route('posts.index')->with('success', 'Post deleted successfully!');
    }
}
