$(document).ready(function () {
  $("img").on("error", function () {
    $(this).attr("src", "https://via.placeholder.com/300?text=Image+Not+Found");
  });
});
