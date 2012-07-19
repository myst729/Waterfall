<?php

$num = $_GET["n"];
$arr = array();
for($i = 0; $i < $num; $i++) {
    $src = rand(1, 60);
    $img = getimagesize("img/" . $src . ".jpg");
    $arr[$i] = array("s" => $src, "h" => $img[1]);
}
echo json_encode($arr);

?>