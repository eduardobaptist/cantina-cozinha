<?php

namespace App\Controllers;

use App\Controllers\BaseController;

class RouterController extends BaseController
{
    public function index()
    {
        return view('pages/cozinha_view');
    }
}
