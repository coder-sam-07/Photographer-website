<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = "sameershedge77100@gmail.com";
    $subject = "New Booking Request";
    
    $message = "Name: " . $_POST['name'] . "\n" .
               "Email: " . $_POST['email'] . "\n" .
               "Contact: " . $_POST['contact'] . "\n" .
               "Event Name: " . $_POST['event_name'] . "\n" .
               "Event Venue: " . $_POST['event_venue'] . "\n" .
               "Service: " . $_POST['service'] . "\n" .
               "Special Request: " . $_POST['special_request'];

    $headers = "From: your-email@example.com"; // Replace with a valid sender email

    if (mail($to, $subject, $message, $headers)) {
        echo "<script>alert('Booking successful! You will receive a confirmation email.');</script>";
    } else {
        echo "<script>alert('Failed to send email. Please try again.');</script>";
    }
}
?>
