// Manejar la visualización del nombre del archivo seleccionado
document
  .getElementById("identificacion")
  .addEventListener("change", function (e) {
    const fileName = this.files.length > 0 ? this.files[0].name : "";
    document.getElementById("file-name").value = fileName;
  });

// Manejar el envío del formulario
document
  .getElementById("cliente-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    // Mostrar loader en el botón
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin mr-2"></i>Guardando...';
    submitBtn.disabled = true;

    try {
      // Crear FormData con todos los campos
      const formData = new FormData(this);

      // Enviar datos mediante Fetch API
      const response = await fetch("php/guardar_cliente.php", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        showNotification("Cliente registrado correctamente!", "success");
        // Resetear el formulario después de guardar
        this.reset();
        document.getElementById("file-name").value = "";
      } else {
        showNotification("Error: " + result.message, "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification("Error en la conexión: " + error.message, "error");
    } finally {
      // Restaurar el botón
      submitBtn.innerHTML = originalBtnContent;
      submitBtn.disabled = false;
      const tablaBody = document.querySelector("tbody");
      tablaBody.innerHTML = `
        <tr id="loader">
            <td colspan="6" class="text-center py-8">
                <div class="flex justify-center">
                    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                </div>
                <p class="mt-2 text-gray-600">Cargando clientes...</p>
            </td>
        </tr>
    `;
      cargarClientes(); // Recargar la lista de clientes
    }
  });

// Función para mostrar notificaciones
function showNotification(message, type) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.className = `notification ${type} show`;

  // Agregar icono según el tipo de notificación
  let icon = "";
  switch (type) {
    case "success":
      icon = '<i class="fas fa-check-circle mr-2"></i>';
      break;
    case "error":
      icon = '<i class="fas fa-exclamation-circle mr-2"></i>';
      break;
    case "info":
      icon = '<i class="fas fa-info-circle mr-2"></i>';
      break;
    default:
      icon = '<i class="fas fa-info-circle mr-2"></i>';
  }

  notification.innerHTML = icon + message;

  setTimeout(() => {
    notification.className = "notification";
  }, 3000);
}

// Función para cargar clientes
async function cargarClientes(page = 1, search = "") {
  const tablaBody = document.querySelector("tbody");
  const paginacionInfo = document.querySelector(".pagination-info");
  const paginacionControles = document.querySelector(".pagination-controls");

  // Limpiar tabla y controles de paginación
  paginacionInfo.textContent = "";
  paginacionControles.innerHTML = "";
  tablaBody.innerHTML = `
  <tr id="loader">
          <td colspan="6" class="text-center py-8">
              <div class="flex justify-center">
                  <div
                      class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12">
                  </div>
              </div>
              <p class="mt-2 text-gray-600">Cargando clientes...</p>
          </td>
  </tr>`;

  const loader = document.getElementById("loader");
  // Mostrar loader
  loader.classList.remove("hidden");
  tablaBody.innerHTML = "";

  try {
    const response = await fetch(
      `php/obtener_clientes.php?page=${page}&search=${encodeURIComponent(
        search
      )}`
    );
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    // Actualizar información de paginación
    paginacionInfo.textContent = `Mostrando ${Math.min(
      page * 10,
      data.total
    )} de ${data.total} clientes`;

    // Generar controles de paginación
    let paginacionHTML = "";
    if (data.totalPages > 1) {
      paginacionHTML = `
                <button class="pagination-btn ${
                  page === 1 ? "disabled" : ""
                }" data-page="${page - 1}">
                    <i class="fas fa-chevron-left"></i>
                </button>`;

      for (let i = 1; i <= data.totalPages; i++) {
        paginacionHTML += `
                    <button class="pagination-btn ${
                      i === page ? "active" : ""
                    }" data-page="${i}"> ${i}
                    </button>`;
      }
      paginacionHTML += `
                <button class="pagination-btn ${
                  page === data.totalPages ? "disabled" : ""
                }" data-page="${page + 1}">
                    <i class="fas fa-chevron-right"></i>
                </button>`;
    }

    paginacionControles.innerHTML = paginacionHTML;

    // Agregar clientes a la tabla
    data.clientes.forEach((cliente) => {
      const row = document.createElement("tr");

      // Determinar tipo de archivo para la imagen
      let imgHTML =
        '<div class="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 mr-3"></div>';
      if (cliente.identificacion_archivo) {
        const extension = cliente.identificacion_archivo
          .split(".")
          .pop()
          .toLowerCase();
        if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
          imgHTML = `<img src="${cliente.identificacion_archivo.substring(
            3
          )}" alt="Identificación" class="w-10 h-10 rounded-lg object-cover mr-3">`;
        } else if (extension === "pdf") {
          imgHTML = `<div class="bg-red-100 text-red-800 rounded-lg w-10 h-10 flex items-center justify-center mr-3">
                                  <i class="fas fa-file-pdf"></i>
                               </div>`;
        }
      }

      // Crear badges de préstamos
      let prestamosHTML = "";
      if (cliente.prestamos_activos > 0) {
        prestamosHTML += `<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">${cliente.prestamos_activos} activos</span> `;
      }
      if (cliente.prestamos_mora > 0) {
        prestamosHTML += `<span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">${cliente.prestamos_mora} en mora</span>`;
      }
      if (!prestamosHTML) {
        prestamosHTML =
          '<span class="text-gray-500 text-xs">Sin préstamos</span>';
      }

      row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">${
                  cliente.codigo_cliente
                }</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        ${imgHTML}
                        <div>
                            <div class="font-medium">${cliente.nombre} ${
        cliente.apellido
      }</div>
                            <div class="text-gray-500">${
                              cliente.correo || "Sin correo"
                            }</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div>${cliente.telefono}</div>
                    <div class="text-gray-500">${
                      cliente.direccion
                        ? cliente.direccion.substring(0, 20) +
                          (cliente.direccion.length > 20 ? "..." : "")
                        : "Sin dirección"
                    }</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    ${cliente.fecha_registro_format}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    ${prestamosHTML}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <button class="text-blue-500 hover:text-blue-700 mr-3 btn-editar" data-id="${
                      cliente.id_cliente
                    }">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-red-500 hover:text-red-700 btn-eliminar" data-id="${
                      cliente.id_cliente
                    }">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;

      tablaBody.appendChild(row);
    });

    // Agregar eventos a los botones de paginación
    document.querySelectorAll(".pagination-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!btn.classList.contains("disabled")) {
          cargarClientes(parseInt(btn.dataset.page), search);
        }
      });
    });

    // Agregar eventos a los botones de editar y eliminar
    document.querySelectorAll(".btn-editar").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        editarCliente(id);
      });
    });

    document.querySelectorAll(".btn-eliminar").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        eliminarCliente(id);
      });
    });
  } catch (error) {
    console.error("Error:", error);
    tablaBody.innerHTML = `<tr>
            <td colspan="6" class="px-6 py-4 text-center text-red-500">
                Error al cargar los datos: ${error.message}
            </td>
        </tr>`;
  } finally {
    // Ocultar loader
    loader.classList.add("hidden");
  }
}

// Función para manejar la búsqueda
function setupBusqueda() {
  const searchInput = document.querySelector(".search-input");
  let timeout = null;

  searchInput.addEventListener("input", (e) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cargarClientes(1, e.target.value);
    }, 500);
  });
}

// Función para editar cliente
function editarCliente(id) {
  // Aquí implementarías la lógica para editar el cliente
  console.log("Editar cliente:", id);
  showNotification("Funcionalidad de edición en desarrollo", "info");
}

// Función para eliminar cliente
async function eliminarCliente(id) {
  if (
    confirm(
      "¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer."
    )
  ) {
    try {
      const response = await fetch(`php/eliminar_cliente.php?id=${id}`);
      const result = await response.json();

      if (result.success) {
        showNotification("Cliente eliminado correctamente", "success");
        cargarClientes();
      } else {
        showNotification("Error: " + result.message, "error");
      }
    } catch (error) {
      showNotification("Error: " + error.message, "error");
    }
  }
}

// Al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  // Agregar loader a la tabla
  cargarClientes();
  setupBusqueda();
  cargarClientesSelect(); // Cargar clientes en el select del modal de préstamos
  cargarFrecuenciasSelect(); // Cargar frecuencias de pago en el select del modal de préstamos

  // Estilos para el loader
  const style = document.createElement("style");
  style.textContent = `
        .loader {
            border-top-color: #3b82f6;
            -webkit-animation: spinner 1.5s linear infinite;
            animation: spinner 1.5s linear infinite;
        }
        @-webkit-keyframes spinner {
            0% { -webkit-transform: rotate(0deg); }
            100% { -webkit-transform: rotate(360deg); }
        }
        @keyframes spinner {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .pagination-btn {
            padding: 8px 12px;
            border-radius: 8px;
            margin: 0 2px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .pagination-btn:hover:not(.disabled) {
            background-color: #e5e7eb;
        }
        .pagination-btn.active {
            background-color: #3b82f6;
            color: white;
        }
        .pagination-btn.disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    `;
  document.head.appendChild(style);
});

// Función para abrir el modal de edición
async function editarCliente(id) {
  try {
    // Obtener los datos del cliente
    const response = await fetch(`php/obtener_cliente_modal.php?id=${id}`);
    const cliente = await response.json();

    if (cliente.error) {
      throw new Error(cliente.error);
    }

    // Mostrar el modal de edición
    mostrarModalEdicion(cliente);
  } catch (error) {
    console.error("Error al cargar cliente:", error);
    showNotification(
      "Error al cargar datos del cliente: " + error.message,
      "error"
    );
  }
}

// Función para mostrar el modal de edición con los datos del cliente
function mostrarModalEdicion(cliente) {
  // Crear el modal de edición
  const modalHTML = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl">
                <div class="header bg-primary text-white p-4 rounded-t-lg">
                    <h2 class="text-xl font-bold"><i class="fas fa-edit mr-2"></i>Editar Cliente</h2>
                    <button class="absolute top-3 right-3 text-white hover:text-gray-200" onclick="cerrarModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="p-6">
                    <form id="editar-cliente-form" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input type="hidden" name="id_cliente" value="${
                          cliente.id_cliente
                        }">
                        <div>
                            <label class="block text-gray-700 mb-2" for="editar-nombre">Nombre</label>
                            <input type="text" id="editar-nombre" name="nombre" value="${
                              cliente.nombre
                            }"
                                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                required>
                        </div>
                        <div>
                            <label class="block text-gray-700 mb-2" for="editar-apellido">Apellido</label>
                            <input type="text" id="editar-apellido" name="apellido" value="${
                              cliente.apellido
                            }"
                                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                required>
                        </div>
                        <div>
                            <label class="block text-gray-700 mb-2" for="editar-telefono">Teléfono</label>
                            <input type="tel" id="editar-telefono" name="telefono" value="${
                              cliente.telefono
                            }"
                                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                required>
                        </div>
                        <div>
                            <label class="block text-gray-700 mb-2" for="editar-correo">Correo Electrónico</label>
                            <input type="email" id="editar-correo" name="correo" value="${
                              cliente.correo || ""
                            }"
                                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-gray-700 mb-2" for="editar-direccion">Dirección</label>
                            <textarea id="editar-direccion" name="direccion"
                                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                rows="3">${cliente.direccion || ""}</textarea>
                        </div>
                        <div>
                            <label class="block text-gray-700 mb-2" for="editar-identificacion">Identificación</label>
                            <div class="flex items-center">
                                <input type="file" id="editar-identificacion" name="identificacion" class="hidden"
                                    accept="image/*, .pdf">
                                <input type="text" id="editar-file-name"
                                    class="w-full px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Seleccionar archivo..." disabled>
                                <button type="button" onclick="document.getElementById('editar-identificacion').click()"
                                    class="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-r-lg">
                                    <i class="fas fa-upload"></i>
                                </button>
                            </div>
                            <p class="text-sm text-gray-500 mt-1">Formatos aceptados: JPG, PNG, PDF</p>
                            ${
                              cliente.identificacion_archivo
                                ? `
                                <div class="mt-2">
                                    <a href="${cliente.identificacion_archivo}" target="_blank" class="text-blue-500 hover:underline">
                                        <i class="fas fa-file-pdf mr-1"></i>Archivo actual
                                    </a>
                                </div>
                            `
                                : ""
                            }
                        </div>
                        <div class="md:col-span-2 flex justify-end mt-4">
                            <button type="button" onclick="cerrarModal()"
                                class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 mr-3">Cancelar</button>
                            <button type="submit" class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700">
                                <i class="fas fa-save mr-2"></i>Actualizar Cliente
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

  // Agregar el modal al documento
  const modalContainer = document.createElement("div");
  modalContainer.id = "editar-cliente-modal";
  modalContainer.innerHTML = modalHTML;
  document.body.appendChild(modalContainer);

  // Manejar el cambio en el input de archivo
  document
    .getElementById("editar-identificacion")
    .addEventListener("change", function (e) {
      const fileName = this.files.length > 0 ? this.files[0].name : "";
      document.getElementById("editar-file-name").value = fileName;
    });

  // Manejar el envío del formulario de edición
  document
    .getElementById("editar-cliente-form")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      await actualizarCliente(this);
    });
}

// Función para cerrar el modal
function cerrarModal() {
  const modal = document.getElementById("editar-cliente-modal");
  if (modal) {
    modal.remove();
  }
}

// Función para actualizar un cliente
async function actualizarCliente(form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnContent = submitBtn.innerHTML;

  submitBtn.innerHTML =
    '<i class="fas fa-spinner fa-spin mr-2"></i>Actualizando...';
  submitBtn.disabled = true;

  try {
    const formData = new FormData(form);

    const response = await fetch("php/actualizar_cliente.php", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      showNotification("Cliente actualizado correctamente!", "success");
      cerrarModal();
      cargarClientes(); // Recargar la lista de clientes
    } else {
      showNotification("Error: " + result.message, "error");
    }
  } catch (error) {
    showNotification("Error en la conexión: " + error.message, "error");
  } finally {
    submitBtn.innerHTML = originalBtnContent;
    submitBtn.disabled = false;
  }
}

//Logica para administrar préstamos

//Cargar clientes en el select del modal de préstamos
async function cargarClientesSelect() {
  const select = document.getElementById("cliente-select");
  select.innerHTML = '<option value="">Cargando clientes...</option>';

  try {
    const response = await fetch("php/obtener_clientes_select.php");
    const clientes = await response.json();

    if (clientes.error) {
      throw new Error(clientes.error);
    }

    select.innerHTML = '<option value="">Seleccione un cliente</option>';
    clientes.forEach((cliente) => {
      select.innerHTML += `<option value="${cliente.id_cliente}">${cliente.texto}</option>`;
    });
  } catch (error) {
    console.error("Error al cargar clientes:", error);
    select.innerHTML = `<option value="">Error al cargar clientes: ${error.message}</option>`;
  }
}

//Cargar frecuencias de pago en el select del modal de préstamos
async function cargarFrecuenciasSelect() {
  const select = document.getElementById("frecuencia-select");
  select.innerHTML = '<option value="">Cargando clientes...</option>';

  try {
    const frecuencias = await fetch("php/obtener_frecuencias.php");
    const data = await frecuencias.json();
    if (data.error) {
      throw new Error(data.error);
    }
    select.innerHTML = '<option value="">Seleccione una frecuencia</option>';
    data.forEach((frecuencia) => {
      select.innerHTML += `<option value="${frecuencia.id}">${frecuencia.descripcion}</option>`;
    });
  } catch (error) {
    console.error("Error al cargar frecuencias:", error);
    select.innerHTML = `<option value="">Error al cargar frecuencias: ${error.message}</option>`;
  }
}

//Manejar el envío del formulario de préstamos
document
  .getElementById("prestamo-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    // Mostrar loader en el botón
    const submitBtn = document.querySelector(
      '#prestamo-form button[type="submit"]'
    );
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin mr-2"></i>Guardando...';
    submitBtn.disabled = true;

    try {
      // Crear FormData con todos los campos
      const formData = new FormData(this);

      // Enviar datos mediante Fetch API
      const response = await fetch("php/guardar_prestamo.php", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        showNotification("Préstamo registrado correctamente!", "success");
        this.reset();
      } else {
        showNotification("Error: " + result.message, "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification("Error en la conexión: " + error.message, "error");
    } finally {
      // Restaurar el botón
      submitBtn.innerHTML = originalBtnContent;
      submitBtn.disabled = false;
      const tablaBody = document.querySelector("tbody");
      tablaBody.innerHTML = `
        <tr id="loader">
            <td colspan="6" class="text-center py-8">
                <div class="flex justify-center">
                    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                </div>
                <p class="mt-2 text-gray-600">Cargando préstamos...</p>
            </td>
        </tr>
    `;
      //cargarPrestamos(); // Recargar la lista de préstamos
    }
  });
