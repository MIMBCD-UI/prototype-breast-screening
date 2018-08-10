/**
 * @author Francisco Maria Calisto <francisco.calisto@tecnico.ulisboa.pt>
 */

loadTemplate("templates/help.html", function(element) {
  $('body').append(element);
  $("#help").click(function() {
    $("#helpModal").modal();
  });
});
