<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Post;
use Illuminate\Support\Facades\DB;

class CreatePostController extends Controller
{
    public function index(){
        return view("create_post");
    }

    public function do_searchpost(Request $request)
    {
        if ($request->api === "opzione1") {

            // COMICVINE API
            $key = env("FUMETTI_KEY");
            $data = urlencode($request->campo);

            $curl = curl_init();
            curl_setopt_array($curl, [
                CURLOPT_URL => "https://comicvine.gamespot.com/api/search/?api_key=".$key.
                               "&format=json&query=".$data."&resources=issue&sort=name:asc&limit=50",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_USERAGENT => "LaravelApp/1.0",
            ]);

            $result = curl_exec($curl);
            curl_close($curl);

            return response()->json(json_decode($result, true));
        } 
        elseif ($request->api === "opzione2") {

            // OPENLIBRARY API
            $data = urlencode($request->campo);

            $curl = curl_init();
            curl_setopt_array($curl, [
                CURLOPT_URL => "https://openlibrary.org/search.json?q=".$data,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPHEADER => [
                    "User-Agent: MySocialGIFApp/1.0"
                ]
            ]);

            $result = curl_exec($curl);

            if (curl_errno($curl)) {
                return response()->json(['error' => curl_error($curl)], 500);
            }

            curl_close($curl);

            return response()->json(json_decode($result, true));
        }
    }   // ← Questa parentesi chiude correttamente TUTTO il metodo



    public function do_createpost(Request $request)
    {
        $user = Auth::user()->id;
        $text = $request->campo2;

        $hidden_url = $request->nascosto;
        $hidden_type = $request->nascosto2;
        $current_date = date("Y-m-d H:i:s");

        $query = Post::create([
            'username_id' => $user,
            'data' => $current_date,
            'text' => $text,
            'url' => $hidden_url,
            'tipe' => $hidden_type,
            'num_like' => 0
        ]);

        return $query ? true : false;
    }
}
