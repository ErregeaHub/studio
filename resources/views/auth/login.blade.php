<x-app-layout>
    <div class="max-w-md mx-auto">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
            <h1 class="text-2xl font-bold text-white mb-6 text-center">Login to MediaFlow</h1>
            
            <form method="POST" action="{{ route('login') }}">
                @csrf
                
                <div class="space-y-6">
                    <div>
                        <label for="email" class="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                        <input type="email" name="email" id="email" required autofocus
                               class="w-full bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:ring-blue-500 focus:border-blue-500 p-3">
                        @error('email') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <input type="password" name="password" id="password" required
                               class="w-full bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:ring-blue-500 focus:border-blue-500 p-3">
                    </div>

                    <div class="flex items-center justify-between">
                        <label class="flex items-center">
                            <input type="checkbox" name="remember" class="rounded bg-slate-950 border-slate-800 text-blue-600 shadow-sm focus:ring-blue-500">
                            <span class="ml-2 text-sm text-slate-400">Remember me</span>
                        </label>
                    </div>

                    <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20">
                        Log In
                    </button>
                    
                    <p class="text-center text-slate-400 text-sm">
                        Don't have an account? <a href="{{ route('register') }}" class="text-blue-500 hover:underline">Register</a>
                    </p>
                </div>
            </form>
        </div>
    </div>
</x-app-layout>
