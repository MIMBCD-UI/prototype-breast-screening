loadTemplate("templates/about.html", function(element) {
    $('body').append(element);
    $("#about").click(function() {
        $("#aboutModal").modal();
    });
});

/* ==================== TESTING THINGS!!!! ==================== */

// module.exports = "my message alert!";

/* ============================================================ */
