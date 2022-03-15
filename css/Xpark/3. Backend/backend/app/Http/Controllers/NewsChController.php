<?php

namespace App\Http\Controllers;

use App\Ch_News;
use Illuminate\Support\Facades\File;
use Illuminate\Http\Request;

class NewsChController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $news_ch_list = Ch_News::all();
        return view('admin.news_ch.index', compact('news_ch_list'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('admin.news_ch.create');
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
            $path = $this->fileUpload($file, 'news_ch');  //$this表示NewsController自己本身
            $requestData['image'] = $path;
        }

        Ch_News::create($requestData);

        return redirect('/admin/news_ch');
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
        $news_ch = Ch_News::find($id);
        return view('admin.news_ch.edit', compact('news_ch'));
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
        $news_ch = Ch_News::find($id);
        $requestData = $request->all();

        if ($request->hasFile('image')) {
            $old_image = $news_ch->image;
            File::delete(public_path() . $old_image);

            $file = $request->file('image');
            $path = $this->fileUpload($file, 'news_ch');
            $requestData['image'] = $path;
        }

        $news_ch->update($requestData);
        return redirect('/admin/news_ch');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $news_ch = Ch_News::find($id);
        $old_image = $news_ch->image;
        if (file_exists(public_path() . $old_image)) {
            File::delete(public_path() . $old_image);
        }
        $news_ch->delete();

        return redirect('/admin/news_ch');
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
