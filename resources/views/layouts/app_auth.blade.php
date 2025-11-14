<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

@include('layouts.head')

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }} | @yield("title")</title>

    <!-- Scripts -->
    @yield('script')

    <!-- Styles -->

    @yield('style')
</head>

<body>
    <nav>
        <div class="nome_sito">Steins;Book</div>
        <ul class="nav_links">
          <li><a class= "active" href= '{{route("home")}}'>HOME</a></li>
          <li><a href= '{{route("create_post")}}'>POST</a></li>
          <li><a href= '{{route("search_people")}}'>FOLLOW</a></li>
          <li> <a href="{{ route('logout') }}" onclick="event.preventDefault();
                 document.getElementById('logout-form').submit();">
                           LOGOUT
                      </a>
                   <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                      @csrf
                   </form> </li>
         </ul>
      </nav>
      @yield('content')
</body>

</html>

