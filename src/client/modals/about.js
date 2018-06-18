/**
 * @author Francisco Maria Calisto <francisco.calisto@tecnico.ulisboa.pt>
 */

loadTemplate("templates/about.html", function(element) {
  $('body').append(element);
  $("#about").click(function() {
    $("#aboutModal").modal();
  });
});
