$(function(){
console.log('Document ready')

getTasks();

$('#task-form').on('submit', addTask);
$('#task-list').on('click', '.update', updateTask);
$('#task-list').on('click', '.delete', deleteTask);

});

function getTasks() {
  $.ajax({
    url: '/tasks',
    type: 'GET',
    success: displayTasks
  });
}

function displayTasks(tasks) {
  console.log('Got tasks from the server', tasks);

  $('#task-list').empty();

  tasks.forEach(function(task){
    var $li = $('<li></li>');

    var $form = $('<form></form>');

    $form.append('<input type="text" name="task" value="' + task.task + '"/>');
    $form.append('<input type="text" name="notes" value="' + task.notes + '"/>');

    var $saveButton = $('<button class="update">update</button>');
    $saveButton.data('id', task.id);
    $form.append($saveButton);

    var $deleteButton = $('<button class="delete">delete</button>');
    $deleteButton.data('id', task.id);
    $form.append($deleteButton);

    $li.append($form);
    $('#task-list').append($li);
  });
}

function addTask(event) {
  // prevent browser from refreshing
  event.preventDefault();

  // get the info out of the form
  var formData = $(this).serialize();

  // send data to server
  $.ajax({
    url: '/tasks',
    type: 'POST',
    data: formData,
    success: getTasks
  });
}

function updateTask(event) {
  event.preventDefault();

  var $button = $(this);
  var $form = $button.closest('form');

  var data = $form.serialize();

  $.ajax({
    url: '/tasks/' + $button.data('id'),
    type: 'PUT',
    data: data,
    success: getTasks
  });
}

function deleteTask (event){
  event.preventDefault();
  $.ajax({
    url: '/tasks/' + $(this).data('id'),
    type: 'DELETE',
    success: getTasks
  });
}
