<?php

namespace App\Http\Controllers;

use App\Ch_Event;
use Illuminate\Support\Facades\File;
use Illuminate\Http\Request;

class EventsChController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $events_ch_list = Ch_Event::all();
        return view('admin.events_ch.index', compact('events_ch_list'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('admin.events_ch.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $requestData = $request->all();
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $path = $this->fileUpload($file, 'events_ch');  
            $requestData['image'] = $path;
        }

        Ch_Event::create($requestData);

        return redirect('/admin/events_ch');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $events_ch = Ch_Event::find($id);
        return view('admin.events_ch.edit', compact('events_ch'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $events_ch = Ch_Event::find($id);
        $requestData = $request->all();

        if ($request->hasFile('image')) {
            $old_image = $events_ch->image;
            File::delete(public_path() . $old_image);

            $file = $request->file('image');
            $path = $this->fileUpload($file, 'evnets_ch');
            $requestData['image'] = $path;
        }

        $events_ch->update($requestData);
        return redirect('/admin/events_ch');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $events_ch = Ch_Event::find($id);
        $old_image = $events_ch->image;
        if (file_exists(public_path() . $old_image)) {
            File::delete(public_path() . $old_image);
        }
        $events_ch->delete();

        return redirect('/admin/events_ch');
    }

    private function fileUpload($file, $dir)
    {
        //防呆：資料夾不存在時將會自動建立資料夾，避免錯誤
        if (!is_dir('upload/')) {
            mkdir('upload/');
        }
        //防呆：資料夾不存在時將會自動建立資料夾，避免錯誤
        if (!is_dir('upload/' . $dir)) {
            mkdir('upload/' . $dir);
        }
        //取得檔案的副檔名
        $extension = $file->getClientOriginalExtension();
        //檔案名稱會被重新命名
        $filename = strval(time() . md5(rand(100, 200))) . '.' . $extension;
        //移動到指定路徑
        move_uploaded_file($file, public_path() . '/upload/' . $dir . '/' . $filename);
        //回傳 資料庫儲存用的路徑格式
        return '/upload/' . $dir . '/' . $filename;
    }
}
