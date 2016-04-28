var socket = io();
var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');

console.log(name + ' wants to join ' + room);

jQuery('.room-title').text(room);

socket.on('connect', function() {
	console.log('Connected to socket.io server!');
	socket.emit('joinRoom', {
		name: name,
		room: room
	});
});

socket.on('message', function(message) {
	var momentTimestamp = moment.utc(message.timestamp);
	var $messages = jQuery('.messages');

	console.log('New message: ');
	console.log(message.text);

	$messages.append('<li class="list-group-item"><strong>' + message.name + ' ' + momentTimestamp.local().format('h:mm a') + ': </strong>'+ message.text +'</li>');
});

//Handles submitting of a new message
var $form = jQuery('#message-form');

$form.on('submit', function(event) {
	event.preventDefault();

	socket.emit('message', {
		name: name,
		text: $form.find('input[name=message]').val()
	});

	$form.find('input[name=message]').val('');
});