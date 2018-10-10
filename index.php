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
                <input type="range" id="speed" name="speed" min="20" max="1000" step="20" value="500" list="speed_list"/>
                <datalist id="speed_list">
                    <option value="20">
                    <option value="100">
                    <option value="200">
                    <option value="300">
                    <option value="400">
                    <option value="500">
                    <option value="600">
                    <option value="700">
                    <option value="800">
                    <option value="900">
                    <option value="1000">
                </datalist>
            </div>
        </div>

        <script src="script/Cell.js"></script>
        <script src="script/Map.js"></script>
        <script src="script/MoChCivilisation.js"></script>
        <script src="script/MoChColony.js"></script>
        <script src="script/gameController.js"></script>
    </body>
</html>

<?php

?>
