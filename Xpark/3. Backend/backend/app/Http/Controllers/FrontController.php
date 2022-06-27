<?php

namespace App\Http\Controllers;

use App\Ch_Event;
use App\Ch_News;
use Illuminate\Http\Request;

class FrontController extends Controller

{   public function nav()
    {
        return view('front/nav');
    }

    public function index()
    {
        return view('front/index');
    }

    public function indexEn()
    {
        return view('front/index');
    }

    public function tour_0()
    {
        return view('front/tour_0');
    }

    public function tour_F()
    {
        return view('front/tour_F');
    }

    public function life()
    {
        return view('front/life');
    }

    public function FAQ()
    {
        return view('front/FAQ');
    }

    public function shopCart()
    {
        return view('front/shopCart');
    }

    public function whats_on()
    {
        $news_ch_list = Ch_News::orderBy('sort', 'asc')->take(4)->get();
        $events_ch_list = Ch_Event::all();
        return view('front/whats_on', compact('news_ch_list','events_ch_list'));
    }

    public function whats_on_en()
    {
        return view('front/whats_on_en');
    }

    public function booking()
    {
        return view('front/booking');
    }
}
