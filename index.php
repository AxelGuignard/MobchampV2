<!DOCTYPE HTML>

<html>
    <head>
        <meta charset="UTF-8">
        <title>Mobchamp</title>
        <link rel="stylesheet" href="css/style.css">
        <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    </head>

    <body>
        <canvas id="viewport"></canvas>
        <div id="display"></div>
        <div id="controls">
            <div id="speed_grp">
                <label for="speed">Speed</label>
                <input type="range" id="speed" name="speed" min="20" max="1000" step="20" value="500"/>
            </div>
        </div>

        <script src="script/Cell.js"></script>
        <script src="script/Land.js"></script>
        <script src="script/Species.js"></script>
        <script src="script/Colony.js"></script>
        <script src="script/gameController.js"></script>
    </body>
</html>

<?php

?>
