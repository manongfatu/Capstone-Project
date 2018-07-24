@extends('layouts.login')

@section('content')

            <div class="panel panel-default">
               <center>

                <div class="panel-body">
                    <form class="form-horizontal" method="POST" action="{{ route('login') }}">
                        {{ csrf_field() }}

                        <div class="form-group{{ $errors->has('email') ? ' has-error' : '' }}">
                            <label for="email" class="col-md-4 control-label fontProductSans">E-mail Address</label>

                            <div class="col-md-6">
                                <input id="email" type="email"  class="form-control fontProductSans" name="email" value="{{ old('email') }}" required autofocus>

                                @if ($errors->has('email'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('email') }}</strong>
                                    </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group{{ $errors->has('password') ? ' has-error' : '' }}">
                            <label for="password" class="col-md-4 control-label fontProductSans">Password</label>

                            <div class="col-md-6">
                                <input id="password" type="password" class="form-control fontProductSans" name="password" required>

                                @if ($errors->has('password'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('password') }}</strong>
                                    </span>
                                @endif
                            </div>
                        </div>

                      

                        <div class="form-group">
                            <div class="col-md-8 col-md-offset-4">

                                 <button type="submit" class="btn btn-primary fontProductSans">
                                    Login
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
   
@endsection
