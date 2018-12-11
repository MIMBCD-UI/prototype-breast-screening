/**
 * @author fmc
 */

loadTemplate("templates/save.html", function(element) {
  $('body').append(element);
  $("#close").click(function() {
    $("#saveModal").modal();
  });
});
