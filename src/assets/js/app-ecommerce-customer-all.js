document.addEventListener("DOMContentLoaded", function (e) {
    config.colors.borderColor, config.colors.bodyBg, config.colors.headingColor;
    let t = document.querySelector(".datatables-customers"),
        o = $(".select2"),
        r;
    o.length &&
        (r = o)
            .wrap('<div class="position-relative"></div>')
            .select2({
                placeholder: "United States ",
                dropdownParent: r.parent(),
            }),
        t &&
            new DataTable(t, {
                ajax: assetsPath + "json/ecommerce-customer-all.json",
                columns: [
                    {data: ""},
                    {
                        data: "id",
                        orderable: !1,
                        render: DataTable.render.select(),
                    },
                    {data: "customer"},
                    {data: "customer_id"},
                    {data: "country"},
                    {data: "order"},
                    {data: "total_spent"},
                ],
                columnDefs: [
                    {
                        className: "control",
                        searchable: !1,
                        orderable: !1,
                        responsivePriority: 2,
                        targets: 0,
                        render: function (e, t, o, r) {
                            return "";
                        },
                    },
                    {
                        targets: 1,
                        orderable: !1,
                        searchable: !1,
                        responsivePriority: 3,
                        checkboxes: !0,
                        checkboxes: {
                            selectAllRender:
                                '<input type="checkbox" class="form-check-input">',
                        },
                        render: function () {
                            return '<input type="checkbox" class="dt-checkboxes form-check-input">';
                        },
                    },
                    {
                        targets: 2,
                        responsivePriority: 1,
                        render: function (e, t, o, r) {
                            var n = o.customer,
                                s = o.email,
                                o = o.image;
                            let a;
                            return `
              <div class="d-flex justify-content-start align-items-center customer-name">
                <div class="avatar-wrapper">
                  <div class="avatar avatar-sm me-3">${(a = o
                      ? `
                <img src="${assetsPath}img/avatars/${o}" alt="Avatar" class="rounded-circle">
              `
                      : `<span class="avatar-initial rounded-circle bg-label-${["success", "danger", "warning", "info", "dark", "primary", "secondary"][Math.floor(6 * Math.random())]}">${(n.match(/\b\w/g) || []).slice(0, 2).join("").toUpperCase()}</span>`)}</div>
                </div>
                <div class="d-flex flex-column">
                  <a href="app-ecommerce-customer-details-overview.html" class="text-heading"><span class="fw-medium">${n}</span></a>
                  <small>${s}</small>
                </div>
              </div>`;
                        },
                    },
                    {
                        targets: 3,
                        render: function (e, t, o, r) {
                            return (
                                "<span class='text-heading'>#" +
                                o.customer_id +
                                "</span>"
                            );
                        },
                    },
                    {
                        targets: 4,
                        render: function (e, t, o, r) {
                            var n = o.country,
                                o = o.country_code;
                            return `
              <div class="d-flex justify-content-start align-items-center customer-country">
                <div>${o ? `<i class="icon-base fis fi fi-${o} rounded-circle me-2 icon-lg"></i>` : '<i class="icon-base fis fi fi-xx rounded-circle me-2 icon-lg"></i>'}</div>
                <div><span>${n}</span></div>
              </div>`;
                        },
                    },
                    {
                        targets: 5,
                        render: function (e, t, o, r) {
                            return "<span>" + o.order + "</span>";
                        },
                    },
                    {
                        targets: 6,
                        render: function (e, t, o, r) {
                            return (
                                '<span class="fw-medium text-heading">' +
                                o.total_spent +
                                "</span>"
                            );
                        },
                    },
                ],
                select: {style: "multi", selector: "td:nth-child(2)"},
                order: [[2, "desc"]],
                layout: {
                    topStart: {
                        rowClass: "row m-3 my-0 justify-content-between",
                        features: [
                            {
                                search: {
                                    placeholder: "Search Order",
                                    text: "_INPUT_",
                                },
                            },
                        ],
                    },
                    topEnd: {
                        features: [
                            {
                                pageLength: {
                                    menu: [10, 25, 50, 100],
                                    text: "_MENU_",
                                },
                            },
                            {
                                buttons: [
                                    {
                                        extend: "collection",
                                        className:
                                            "btn btn-label-primary dropdown-toggle me-4",
                                        text: '<span class="d-flex align-items-center gap-2"><i class="icon-base bx bx-export icon-xs"></i> <span class="d-none d-sm-inline-block">Export</span></span>',
                                        buttons: [
                                            {
                                                extend: "print",
                                                text: '<span class="d-flex align-items-center"><i class="icon-base bx bx-printer me-1"></i>Print</span>',
                                                className: "dropdown-item",
                                                exportOptions: {
                                                    columns: [3, 4, 5, 6],
                                                    format: {
                                                        body: function (
                                                            e,
                                                            t,
                                                            o,
                                                        ) {
                                                            if (
                                                                e.length <= 0 ||
                                                                !(
                                                                    -1 <
                                                                    e.indexOf(
                                                                        "<",
                                                                    )
                                                                )
                                                            )
                                                                return e;
                                                            {
                                                                e =
                                                                    new DOMParser().parseFromString(
                                                                        e,
                                                                        "text/html",
                                                                    );
                                                                let t = "";
                                                                var r =
                                                                    e.querySelectorAll(
                                                                        ".customer-name",
                                                                    );
                                                                return (
                                                                    0 < r.length
                                                                        ? r.forEach(
                                                                              (
                                                                                  e,
                                                                              ) => {
                                                                                  e =
                                                                                      e.querySelector(
                                                                                          ".fw-medium",
                                                                                      )
                                                                                          ?.textContent ||
                                                                                      e.querySelector(
                                                                                          ".d-block",
                                                                                      )
                                                                                          ?.textContent ||
                                                                                      e.textContent;
                                                                                  t +=
                                                                                      e.trim() +
                                                                                      " ";
                                                                              },
                                                                          )
                                                                        : (t =
                                                                              e
                                                                                  .body
                                                                                  .textContent ||
                                                                              e
                                                                                  .body
                                                                                  .innerText),
                                                                    t.trim()
                                                                );
                                                            }
                                                        },
                                                    },
                                                },
                                                customize: function (e) {
                                                    (e.document.body.style.color =
                                                        config.colors.headingColor),
                                                        (e.document.body.style.borderColor =
                                                            config.colors.borderColor),
                                                        (e.document.body.style.backgroundColor =
                                                            config.colors.bodyBg);
                                                    e =
                                                        e.document.body.querySelector(
                                                            "table",
                                                        );
                                                    e.classList.add("compact"),
                                                        (e.style.color =
                                                            "inherit"),
                                                        (e.style.borderColor =
                                                            "inherit"),
                                                        (e.style.backgroundColor =
                                                            "inherit");
                                                },
                                            },
                                            {
                                                extend: "csv",
                                                text: '<span class="d-flex align-items-center"><i class="icon-base bx bx-file me-1"></i>Csv</span>',
                                                className: "dropdown-item",
                                                exportOptions: {
                                                    columns: [3, 4, 5, 6],
                                                    format: {
                                                        body: function (
                                                            e,
                                                            t,
                                                            o,
                                                        ) {
                                                            if (e.length <= 0)
                                                                return e;
                                                            e =
                                                                new DOMParser().parseFromString(
                                                                    e,
                                                                    "text/html",
                                                                );
                                                            let r = "";
                                                            var n =
                                                                e.querySelectorAll(
                                                                    ".customer-name",
                                                                );
                                                            return (
                                                                0 < n.length
                                                                    ? n.forEach(
                                                                          (
                                                                              e,
                                                                          ) => {
                                                                              e =
                                                                                  e.querySelector(
                                                                                      ".fw-medium",
                                                                                  )
                                                                                      ?.textContent ||
                                                                                  e.querySelector(
                                                                                      ".d-block",
                                                                                  )
                                                                                      ?.textContent ||
                                                                                  e.textContent;
                                                                              r +=
                                                                                  e.trim() +
                                                                                  " ";
                                                                          },
                                                                      )
                                                                    : (r =
                                                                          e.body
                                                                              .textContent ||
                                                                          e.body
                                                                              .innerText),
                                                                r.trim()
                                                            );
                                                        },
                                                    },
                                                },
                                            },
                                            {
                                                extend: "excel",
                                                text: '<span class="d-flex align-items-center"><i class="icon-base bx bxs-file-export me-1"></i>Excel</span>',
                                                className: "dropdown-item",
                                                exportOptions: {
                                                    columns: [3, 4, 5, 6],
                                                    format: {
                                                        body: function (
                                                            e,
                                                            t,
                                                            o,
                                                        ) {
                                                            if (e.length <= 0)
                                                                return e;
                                                            e =
                                                                new DOMParser().parseFromString(
                                                                    e,
                                                                    "text/html",
                                                                );
                                                            let r = "";
                                                            var n =
                                                                e.querySelectorAll(
                                                                    ".customer-name",
                                                                );
                                                            return (
                                                                0 < n.length
                                                                    ? n.forEach(
                                                                          (
                                                                              e,
                                                                          ) => {
                                                                              e =
                                                                                  e.querySelector(
                                                                                      ".fw-medium",
                                                                                  )
                                                                                      ?.textContent ||
                                                                                  e.querySelector(
                                                                                      ".d-block",
                                                                                  )
                                                                                      ?.textContent ||
                                                                                  e.textContent;
                                                                              r +=
                                                                                  e.trim() +
                                                                                  " ";
                                                                          },
                                                                      )
                                                                    : (r =
                                                                          e.body
                                                                              .textContent ||
                                                                          e.body
                                                                              .innerText),
                                                                r.trim()
                                                            );
                                                        },
                                                    },
                                                },
                                            },
                                            {
                                                extend: "pdf",
                                                text: '<span class="d-flex align-items-center"><i class="icon-base bx bxs-file-pdf me-1"></i>Pdf</span>',
                                                className: "dropdown-item",
                                                exportOptions: {
                                                    columns: [3, 4, 5, 6],
                                                    format: {
                                                        body: function (
                                                            e,
                                                            t,
                                                            o,
                                                        ) {
                                                            if (e.length <= 0)
                                                                return e;
                                                            e =
                                                                new DOMParser().parseFromString(
                                                                    e,
                                                                    "text/html",
                                                                );
                                                            let r = "";
                                                            var n =
                                                                e.querySelectorAll(
                                                                    ".customer-name",
                                                                );
                                                            return (
                                                                0 < n.length
                                                                    ? n.forEach(
                                                                          (
                                                                              e,
                                                                          ) => {
                                                                              e =
                                                                                  e.querySelector(
                                                                                      ".fw-medium",
                                                                                  )
                                                                                      ?.textContent ||
                                                                                  e.querySelector(
                                                                                      ".d-block",
                                                                                  )
                                                                                      ?.textContent ||
                                                                                  e.textContent;
                                                                              r +=
                                                                                  e.trim() +
                                                                                  " ";
                                                                          },
                                                                      )
                                                                    : (r =
                                                                          e.body
                                                                              .textContent ||
                                                                          e.body
                                                                              .innerText),
                                                                r.trim()
                                                            );
                                                        },
                                                    },
                                                },
                                            },
                                            {
                                                extend: "copy",
                                                text: '<i class="icon-base bx bx-copy me-1"></i>Copy',
                                                className: "dropdown-item",
                                                exportOptions: {
                                                    columns: [3, 4, 5, 6],
                                                    format: {
                                                        body: function (
                                                            e,
                                                            t,
                                                            o,
                                                        ) {
                                                            if (e.length <= 0)
                                                                return e;
                                                            e =
                                                                new DOMParser().parseFromString(
                                                                    e,
                                                                    "text/html",
                                                                );
                                                            let r = "";
                                                            var n =
                                                                e.querySelectorAll(
                                                                    ".customer-name",
                                                                );
                                                            return (
                                                                0 < n.length
                                                                    ? n.forEach(
                                                                          (
                                                                              e,
                                                                          ) => {
                                                                              e =
                                                                                  e.querySelector(
                                                                                      ".fw-medium",
                                                                                  )
                                                                                      ?.textContent ||
                                                                                  e.querySelector(
                                                                                      ".d-block",
                                                                                  )
                                                                                      ?.textContent ||
                                                                                  e.textContent;
                                                                              r +=
                                                                                  e.trim() +
                                                                                  " ";
                                                                          },
                                                                      )
                                                                    : (r =
                                                                          e.body
                                                                              .textContent ||
                                                                          e.body
                                                                              .innerText),
                                                                r.trim()
                                                            );
                                                        },
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                    {
                                        text: '<span class="d-flex align-items-center gap-2"><i class="icon-base bx bx-plus icon-sm"></i> <span class="d-none d-sm-inline-block">Add Customer</span></span>',
                                        className: "create-new btn btn-primary",
                                        attr: {
                                            "data-bs-toggle": "offcanvas",
                                            "data-bs-target":
                                                "#offcanvasEcommerceCustomerAdd",
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                    bottomStart: {
                        rowClass: "row mx-3 justify-content-between",
                        features: ["info"],
                    },
                    bottomEnd: {paging: {firstLast: !1}},
                },
                language: {
                    paginate: {
                        next: '<i class="icon-base bx bx-chevron-right scaleX-n1-rtl icon-18px"></i>',
                        previous:
                            '<i class="icon-base bx bx-chevron-left scaleX-n1-rtl icon-18px"></i>',
                    },
                },
                responsive: {
                    details: {
                        display: DataTable.Responsive.display.modal({
                            header: function (e) {
                                return "Details of " + e.data().customer;
                            },
                        }),
                        type: "column",
                        renderer: function (e, t, o) {
                            var r,
                                n,
                                s,
                                o = o
                                    .map(function (e) {
                                        return "" !== e.title
                                            ? `<tr data-dt-row="${e.rowIndex}" data-dt-column="${e.columnIndex}">
                      <td>${e.title}:</td>
                      <td>${e.data}</td>
                    </tr>`
                                            : "";
                                    })
                                    .join("");
                            return (
                                !!o &&
                                ((r =
                                    document.createElement(
                                        "div",
                                    )).classList.add("table-responsive"),
                                (n = document.createElement("table")),
                                r.appendChild(n),
                                n.classList.add("table"),
                                ((s =
                                    document.createElement("tbody")).innerHTML =
                                    o),
                                n.appendChild(s),
                                r)
                            );
                        },
                    },
                },
            }),
        setTimeout(() => {
            [
                {selector: ".dt-buttons", classToAdd: "gap-4"},
                {
                    selector: ".dt-buttons .btn-group .btn",
                    classToRemove: "btn-secondary",
                    classToAdd: "btn-label-secondary",
                },
                {
                    selector: ".dt-buttons .btn-group ~ .btn",
                    classToRemove: "btn-secondary",
                },
                {
                    selector: ".dt-search .form-control",
                    classToRemove: "form-control-sm",
                    classToAdd: "ms-0",
                },
                {
                    selector: ".dt-length .form-select",
                    classToRemove: "form-select-sm",
                },
                {selector: ".dt-length", classToAdd: "mt-0 mt-md-6"},
                {
                    selector: ".dt-layout-end",
                    classToAdd: "gap-2 mt-0 mb-md-0 mb-4",
                },
                {selector: ".dt-layout-start", classToAdd: "mt-0"},
                {selector: ".dt-layout-table", classToRemove: "row mt-2"},
                {
                    selector: ".dt-layout-full",
                    classToRemove: "col-md col-12",
                    classToAdd: "table-responsive",
                },
            ].forEach(({selector: e, classToRemove: o, classToAdd: r}) => {
                document.querySelectorAll(e).forEach((t) => {
                    o && o.split(" ").forEach((e) => t.classList.remove(e)),
                        r && r.split(" ").forEach((e) => t.classList.add(e));
                });
            });
        }, 100);
}),
    (() => {
        var e = document.querySelectorAll(".phone-mask"),
            t = document.getElementById("eCommerceCustomerAddForm");
        e &&
            e.forEach(function (t) {
                t.addEventListener("input", (e) => {
                    e = e.target.value.replace(/\D/g, "");
                    t.value = formatGeneral(e, {
                        blocks: [3, 3, 4],
                        delimiters: [" ", " "],
                    });
                }),
                    registerCursorTracker({input: t, delimiter: " "});
            }),
            FormValidation.formValidation(t, {
                fields: {
                    customerName: {
                        validators: {
                            notEmpty: {message: "Please enter fullname "},
                        },
                    },
                    customerEmail: {
                        validators: {
                            notEmpty: {message: "Please enter your email"},
                            emailAddress: {
                                message:
                                    "The value is not a valid email address",
                            },
                        },
                    },
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap5: new FormValidation.plugins.Bootstrap5({
                        eleValidClass: "",
                        rowSelector: function (e, t) {
                            return ".form-control-validation";
                        },
                    }),
                    submitButton: new FormValidation.plugins.SubmitButton(),
                    autoFocus: new FormValidation.plugins.AutoFocus(),
                },
            });
    })();
