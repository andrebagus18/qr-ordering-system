<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);
        $user = User::where(
            'email',
            $credentials['email']
        )->first();
        if (!$user || !Hash::check(
            $credentials['password'],
            $user->password
        )) {
            return response()->json([
                'msg' => 'Email atau password salah',
            ], 401);
        }
        Auth::guard('web')->login($user);
        $request->session()->regenerate();
        return response()->json([
            'msg' => 'Login berhasil',
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json([
            'msg' => 'Logout berhasil',
        ]);
    }
}
