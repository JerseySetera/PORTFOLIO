<?php
// send_email.php

// Import PHPMailer classes into the global namespace
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Load the PHPMailer files
require 'phpmailer/Exception.php';
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';

// Set response header to JSON
header('Content-Type: application/json');

// Check if the form was submitted via POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get and sanitize form data
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

    // Basic validation
    if (empty($name) || empty($email) || empty($message)) {
        echo json_encode(['success' => false, 'message' => 'Please fill in all fields.']);
        exit;
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
        exit;
    }

    // Create a new PHPMailer instance
    $mail = new PHPMailer(true);

    try {
        // --- Server settings ---
        // $mail->SMTPDebug = SMTP::DEBUG_SERVER; // Enable verbose debug output for testing
        $mail->isSMTP();                                // Send using SMTP
        $mail->Host       = 'smtp.gmail.com';           // Set the SMTP server to send through
        $mail->SMTPAuth   = true;                       // Enable SMTP authentication
        $mail->Username   = 'jerseyzenith88l@gmail.com';     // ** YOUR GMAIL ADDRESS **
        $mail->Password   = 'bdqu vwqq cwbq iuoj';   // ** YOUR GMAIL APP PASSWORD **
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // Enable implicit TLS encryption
        $mail->Port       = 465;                        // TCP port to connect to

        // --- Recipients ---
        $mail->setFrom('your.email@gmail.com', 'Portfolio Contact Form'); // The "from" address (your gmail)
        $mail->addAddress('jerseyzenith88@gmail.com', 'Jersey Zenith');      // The "to" address (where you want to receive the email)
        $mail->addReplyTo($email, $name); // Set the "Reply-To" to be the person who submitted the form

        // --- Content ---
        $mail->isHTML(false); // Set email format to plain text
        $mail->Subject = 'New Portfolio Contact Form Submission from ' . $name;
        
        // Construct email body
        $email_body = "You have received a new message from your portfolio contact form.\n\n";
        $email_body .= "Name: " . $name . "\n";
        $email_body .= "Email: " . $email . "\n\n";
        $email_body .= "Message:\n" . $message;
        $mail->Body = $email_body;

        // Send the email
        $mail->send();
        echo json_encode(['success' => true, 'message' => 'Your message has been sent successfully!']);

    } catch (Exception $e) {
        // Log the error for debugging
        error_log("PHPMailer Error: {$mail->ErrorInfo}");
        echo json_encode(['success' => false, 'message' => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
    }

} else {
    // If not a POST request
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
