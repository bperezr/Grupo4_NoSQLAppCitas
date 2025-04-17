function ConsultarCedula() {
    let cedula = $("#Cedula").val();

    $.ajax({
        url: "https://apis.gometa.org/cedulas/" + cedula,
        method: "GET",
        datatype: "json",
        success: function (response) {
            if (response.results && response.results.length > 0) {
                let result = response.results[0];

                let nombres = [];
                let apellidos = [];

                if (response.tipoIdentificacion === "01") { // Persona física
                    if (result.firstname1) nombres.push(result.firstname1);
                    if (result.firstname2) nombres.push(result.firstname2);
                    if (result.lastname1) apellidos.push(result.lastname1);
                    if (result.lastname2) apellidos.push(result.lastname2);
                } else if (response.tipoIdentificacion === "02") { // Jurídica
                    nombres.push(result.fullname || response.nombre || "");
                }

                // Capitalizar cada palabra
                const formatWords = (arr) => arr.join(' ').split(' ').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                ).join(' ');

                $("#Nombre").val(formatWords(nombres));
                $("#Apellido").val(formatWords(apellidos));
            }
        }
    });
}
