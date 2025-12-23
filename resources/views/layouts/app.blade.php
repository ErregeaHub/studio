<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'MediaFlow') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="font-sans antialiased bg-slate-950 text-slate-200">
    <div class="min-h-screen">
        <!-- Navigation -->
        <nav class="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <div class="flex items-center">
                        <a href="{{ route('posts.index') }}" class="text-2xl font-bold text-blue-500">
                            MediaFlow
                        </a>
                        <div class="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                            <a href="{{ route('posts.index') }}?sort=newest" class="text-slate-300 hover:text-blue-400">Newest</a>
                            <a href="{{ route('posts.index') }}?sort=popular" class="text-slate-300 hover:text-blue-400">Popular</a>
                            <a href="{{ route('posts.index') }}?sort=most_viewed" class="text-slate-300 hover:text-blue-400">Most Viewed</a>
                        </div>
                    </div>
                    
                    <div class="flex items-center space-x-4">
                        @auth
                            <a href="{{ route('posts.create') }}" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                                Upload
                            </a>
                            <div class="relative">
                                <span class="text-slate-300">{{ Auth::user()->name }}</span>
                                <form method="POST" action="{{ route('logout') }}" class="inline ml-4">
                                    @csrf
                                    <button type="submit" class="text-sm text-slate-400 hover:text-red-400">Logout</button>
                                </form>
                            </div>
                        @else
                            <a href="{{ route('login') }}" class="text-slate-300 hover:text-white">Login</a>
                            <a href="{{ route('register') }}" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Register</a>
                        @endauth
                    </div>
                </div>
            </div>
        </nav>

        <!-- Page Content -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            @if (session('success'))
                <div class="mb-4 bg-green-900/50 border border-green-500 text-green-200 p-4 rounded-lg">
                    {{ session('success') }}
                </div>
            @endif

            {{ $slot }}
        </main>
    </div>
</body>
</html>
