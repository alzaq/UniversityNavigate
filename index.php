<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="Summer School Exchange Students Project">
        <meta name="author" content="University of Hradec Kralove Students">

        <title>CityU Navigate</title>

        <link rel="icon" href="/style/favicon.ico">
        <link rel="stylesheet" href="/build/bootstrap/css/bootstrap.min.css">
        <link rel="stylesheet" href="/style/stylesheet.css">

        <script src="https://code.jquery.com/jquery-2.2.4.js" integrity="sha256-iT6Q9iMJYuQiMWNd9lDyBUStIq/8PuOW33aOqmvFpqI=" crossorigin="anonymous"></script>
        <script type="text/javascript" src="/build/bootstrap/js/bootstrap.min.js"></script>

        <!-- <script type="text/javascript" src="/build/react/react.min.js"></script>
        <script type="text/javascript" src="/build/react/react-dom.min.js"></script>
        <script type="text/javascript" src="/build/react/react-dom-server.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.34/browser.min.js"></script> -->

        <script src="https://www.gstatic.com/firebasejs/3.2.0/firebase.js"></script>

        <!-- <script type="text/babel" src="/js/component/modalDialog.js"></script>
        <script type="text/babel" src="/js/component/signInModalDialog.js"></script>
        <script type="text/babel" src="/js/component/signUpModalDialog.js"></script>
        <script type="text/babel" src="/js/component/UserStatusComponent.js"></script> -->

        <script type="text/javascript" src="/js/core.js"></script>
        <script type="text/javascript" src="/js/index.js"></script>

    </head>

    <body>

        <div id="containerLog"></div>

        <div id="containerMessage"></div>

        <div class="container">
            <div class="header clearfix">
                <nav class="pull-right">
                    <div class="btn-group">
                        <a href="/" class="btn btn-primary" role="button">Home</a>
                    </div>
                    <div id="containerUnlogged" class="btn-group" style="display: inline-block;">
                        <a id="btnSignIn" href="/" class="btn" role="button">Sign In</a>
                    </div>
                    <div id="containerLogged" class="btn-group" style="display: none;">
                        <a class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span id="userStatusEmail"></span> <span class="caret"></span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-right">
                            <li><a href="#">Change password</a></li>
                            <li role="separator" class="divider"></li>
                            <li><a href="#" id="btnSignOut">Logout</a></li>
                        </ul>
                    </div>
                </nav>
                <img src="style/logo.png" alt="University Navigation">
                <h3 class="text-muted">University Navigate</h3>
            </div>

            <div id="containerContent">
            </div>

            <footer class="footer">
                <p>&copy; 2016 University of Hradec Kralove, Faculty of Informatics and Management</p>
            </footer>

        </div> <!-- /container -->

        <!-- Modal -->
        <div id="containerModal"></div>

    </body>
</html>