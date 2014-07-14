<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>KineticJS Experiments</title>
    <link rel="stylesheet" href="style.css">

    <script src="kinetic-v5.1.0.min.js"></script>
    <script src="jquery-2.1.1.min.js"></script>
    <?php
        if ($_GET["script"] == 1) echo "<script src='script.js'></script>\n";
        elseif ($_GET["script"] == 2) echo "<script src='script-arcs.js'></script>\n";
    ?>
</head>
<body>
<a href="/canvas/?script=1">Bulles</a> | <a href="/canvas/?script=2">Arcs</a>

<div id="canvas"></div>


</body>
</html>