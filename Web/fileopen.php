<?php
// Store the file name in a string.
$filename = "http://tvcountdown.com/s/american-horror-story";

//$source_code = fread($handle,900);

// Open the file.
$filehandle = fopen($filename, "rt");

// Read the files contents.
$contents = fread($filehandle, 10000);

// Close file.
fclose($filehandle);

// Echo the files contents
//echo $contents;

//$url = 'http://www.example.com.somepage.php'; 
//$needle = '<b>find me</b>'; 
//$contents = file_get_contents($url); 
//if(strpos($contents, $needle)!== false) { 

//<span style="font-size:18px" id="countdown">4d 19h 39m 33s</span>
$string = '<span&nbsp;style';

if(strstr($contents,$string)) {
echo "found it.";
} else {
echo "not found.";
}



?>