$(function(){

getTasks();

$('#task-form').on('click', '#addTask', addTask);
$('#task-table').on('change', '#checkIt', updateCheck);
$('#task-table').on('click', '.update', updateTask);
$('#task-table').on('click', '.delete', deleteTask);


});

function getTasks() {
  $.ajax({
    url: '/tasks',
    type: 'GET',
    success: displayTasks
  });
}

function displayTasks(tasks){

    $('#table-body').empty();

    tasks.forEach(function(task){

    var $tableRow = $('<tr></tr>');

    if (task.complete == true){
      var $checkBox = $(('<td><input id="checkIt" type="checkbox" name="complete" value="false" checked/></td>'));
      $checkBox.data('id', task.id);
      $tableRow.append($checkBox);
    } else {
      var $checkBox = $(('<td><input id="checkIt" type="checkbox" name="complete" value="true"/></td>'));
      $checkBox.data('id', task.id);
      $tableRow.append($checkBox);
    }

    $tableRow.append('<td><input class="focus editFields" type="text" name="task" value="' + task.task +'"/></td>');
    $tableRow.append('<td><input class="focus editFields" type="text" name="notes" value="' + task.notes + '"/></td>');

    // var $checkBox = $(('<td><input id="checkIt" type="checkbox" name="complete" value="'+task.complete+'"/></td>'));
    // $checkBox.data('id', task.id);
    // $tableRow.append($checkBox);
    var $now = $.now();
    var time = $now.toLocaleDateString;
    if (task.update == null) {
      $tableRow.append('<td id="theDate">' + $now + '</td>');
    } else {
      $tableRow.append('<td id="theDate">' + task.updated + '</td>');
    }

    var $updateButton = $('<td><button class="update btn btn-outline-success btn-sm"><i class="fa fa-pencil" aria-hidden="true"></i></button></td>');
    $updateButton.data('id', task.id);
    $tableRow.append($updateButton);

    var $deleteButton = $('<td><button class="delete btn btn-outline-danger btn-sm"><i class="fa fa-trash" aria-hidden="true"></i></button></td>');
    $deleteButton.data('id', task.id);
    $tableRow.append($deleteButton);

    console.log($('#checkIt').attr('value'));

    $('#task-table').append($tableRow);

    // if ($('#checkIt').attr('value') === 'true'){
    //   $("#checkIt").parent().siblings().children().css({'text-decoration': 'line-through', 'background-color': 'red', 'color': 'red'});
    //   $("#checkIt").attr('checked', true);
    // };
    //$('#checkIt:checked').parent().siblings().children().css('text-decoration', 'line-through');
    $("[value=false]").parent().siblings().find('input').css({'text-decoration': 'line-through', 'color': 'lightgray'});

  });
}

function addTask(event) {
  event.preventDefault();

  var formData = $('#task-form').serialize();

  $.ajax({
    url: '/tasks',
    type: 'POST',
    data: formData,
    success: getTasks
  });
  swal("Great!", "You added a task!", "success")

  $('#task-form').find('input[type=text]').val('');
}

function updateCheck(event) {
  event.preventDefault();

  var $check = $(this).parent();
  var $table = $check.closest('tr');

  var data = $table.find('input');

  $.ajax({
    url: '/tasks/' + $check.data('id'),
    type: 'PUT',
    data: data.serialize(),
    success: getTasks
  });

  swal("OK", "You changed the status of a task.")
}

function updateTask(event) {
  event.preventDefault();

  var $button = $(this).parent();
  var $table = $button.closest('tr');

  var data = $table.find('input');

  $.ajax({
    url: '/tasks/' + $button.data('id'),
    type: 'PUT',
    data: data.serialize(),
    success: getTasks
  });
  swal("Excellent!", "Your task has been updated!", "success")
}

// function deleteTask (event){
//   console.log('this:', this);
//   var confirmation = confirm ('Are you sure you want to delete this entry?');
//   if (confirmation == true) {
//     event.preventDefault();
//     $.ajax({
//       url: '/tasks/' + $(this).parent().data('id'),
//       type: 'DELETE',
//       success: getTasks
//     });
//   }
// }

function deleteTask (event){
  // console.log('this:', this);
  swal({
    title: "Are you sure?",
    text: "You will not be able to recover this task!",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel please!",
    closeOnConfirm: false,
    closeOnCancel: false },
    function(isConfirm){
      if (isConfirm) {
        event.preventDefault();
        console.log('this:', $('.delete'));
        swal("Deleted!", "You have succesfully deleted this task", "success");
        $.ajax({
          url: '/tasks/' + $('.delete').parent().data('id'),
          type: 'DELETE',
          success: getTasks
        });
      } else {
        swal("Cancelled", "Your task is safe.", "error");
      }// end else
    });// end swal alert
} // end of deleteTask
