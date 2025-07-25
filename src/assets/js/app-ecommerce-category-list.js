let commentEditor = document.querySelector(".comment-editor");
commentEditor &&
    new Quill(commentEditor, {
        modules: {toolbar: ".comment-toolbar"},
        placeholder: "Write a Comment...",
        theme: "snow",
    }),
    document.addEventListener("DOMContentLoaded", function (e) {
        var t = document.querySelector(".datatables-category-list"),
            a = $(".select2");
        a.length &&
            a.each(function () {
                var e = $(this);
                e.wrap('<div class="position-relative"></div>').select2({
                    dropdownParent: e.parent(),
                    placeholder: e.data("placeholder"),
                });
            }),
            t &&
                new DataTable(t, {
                    ajax: assetsPath + "json/ecommerce-category-list.json",
                    columns: [
                        {data: "id"},
                        {
                            data: "id",
                            orderable: !1,
                            render: DataTable.render.select(),
                        },
                        {data: "categories"},
                        {data: "total_products"},
                        {data: "total_earnings"},
                        {data: "id"},
                    ],
                    columnDefs: [
                        {
                            className: "control",
                            searchable: !1,
                            orderable: !1,
                            responsivePriority: 1,
                            targets: 0,
                            render: function (e, t, a, o) {
                                return "";
                            },
                        },
                        {
                            targets: 1,
                            orderable: !1,
                            searchable: !1,
                            responsivePriority: 4,
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
                            responsivePriority: 2,
                            render: function (e, t, a, o) {
                                var s = a.categories,
                                    r = a.category_detail,
                                    n = a.cat_image;
                                let l;
                                return `
              <div class="d-flex align-items-center">
                <div class="avatar-wrapper me-3 rounded-2 bg-label-secondary">
                  <div class="avatar">${(l = n ? `<img src="${assetsPath}img/ecommerce-images/${n}" alt="Product-${a.id}" class="rounded">` : `<span class="avatar-initial rounded-2 bg-label-${["success", "danger", "warning", "info", "dark", "primary", "secondary"][Math.floor(6 * Math.random())]}">${(r.match(/\b\w/g) || []).slice(0, 2).join("").toUpperCase()}</span>`)}</div>
                </div>
                <div class="d-flex flex-column justify-content-center">
                  <span class="text-heading text-wrap fw-medium">${s}</span>
                  <span class="text-truncate mb-0 d-none d-sm-block"><small>${r}</small></span>
                </div>
              </div>`;
                            },
                        },
                        {
                            targets: 3,
                            responsivePriority: 3,
                            render: function (e, t, a, o) {
                                return (
                                    '<div class="text-sm-end">' +
                                    a.total_products +
                                    "</div>"
                                );
                            },
                        },
                        {
                            targets: 4,
                            orderable: !1,
                            render: function (e, t, a, o) {
                                return (
                                    "<div class='mb-0 text-sm-end'>" +
                                    a.total_earnings +
                                    "</div"
                                );
                            },
                        },
                        {
                            targets: -1,
                            title: "Actions",
                            searchable: !1,
                            orderable: !1,
                            render: function (e, t, a, o) {
                                return `
              <div class="d-flex align-items-sm-center justify-content-sm-center">
                <button class="btn btn-icon"><i class="icon-base bx bx-edit icon-md"></i></button>
                <button class="btn btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                  <i class="icon-base bx bx-dots-vertical-rounded icon-md"></i>
                </button>
                <div class="dropdown-menu dropdown-menu-end m-0">
                  <a href="javascript:void(0);" class="dropdown-item">View</a>
                  <a href="javascript:void(0);" class="dropdown-item">Suspend</a>
                </div>
              </div>
            `;
                            },
                        },
                    ],
                    select: {style: "multi", selector: "td:nth-child(2)"},
                    order: [2, "desc"],
                    layout: {
                        topStart: {
                            rowClass: "row m-3 my-0 justify-content-between",
                            features: [
                                {
                                    search: {
                                        placeholder: "Search Category",
                                        text: "_INPUT_",
                                    },
                                },
                            ],
                        },
                        topEnd: {
                            rowClass: "row m-3 my-0 justify-content-between",
                            features: {
                                pageLength: {
                                    menu: [10, 25, 50, 100],
                                    text: "_MENU_",
                                },
                                buttons: [
                                    {
                                        text: '<i class="icon-base bx bx-plus icon-sm me-0 me-sm-2"></i><span class="d-none d-sm-inline-block">Add Category</span>',
                                        className: "add-new btn btn-primary",
                                        attr: {
                                            "data-bs-toggle": "offcanvas",
                                            "data-bs-target":
                                                "#offcanvasEcommerceCategoryList",
                                        },
                                    },
                                ],
                            },
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
                                    return "Details of " + e.data().categories;
                                },
                            }),
                            type: "column",
                            renderer: function (e, t, a) {
                                var o,
                                    s,
                                    r,
                                    a = a
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
                                    !!a &&
                                    ((o =
                                        document.createElement(
                                            "div",
                                        )).classList.add("table-responsive"),
                                    (s = document.createElement("table")),
                                    o.appendChild(s),
                                    s.classList.add("table"),
                                    ((r =
                                        document.createElement(
                                            "tbody",
                                        )).innerHTML = a),
                                    s.appendChild(r),
                                    o)
                                );
                            },
                        },
                    },
                }),
            setTimeout(() => {
                [
                    {
                        selector: ".dt-buttons .btn",
                        classToRemove: "btn-secondary",
                    },
                    {
                        selector: ".dt-search .form-control",
                        classToRemove: "form-control-sm",
                        classToAdd: "ms-0",
                    },
                    {selector: ".dt-search", classToAdd: "mb-0 mb-md-6"},
                    {
                        selector: ".dt-length .form-select",
                        classToRemove: "form-select-sm",
                    },
                    {
                        selector: ".dt-layout-table",
                        classToRemove: "row mt-2",
                        classToAdd: "border-top",
                    },
                    {selector: ".dt-layout-start", classToAdd: "px-3 mt-0"},
                    {
                        selector: ".dt-layout-end",
                        classToAdd: "px-3 column-gap-2 mt-0 mb-md-0 mb-4",
                    },
                    {
                        selector: ".dt-layout-full",
                        classToAdd: "table-responsive",
                    },
                ].forEach(({selector: e, classToRemove: a, classToAdd: o}) => {
                    document.querySelectorAll(e).forEach((t) => {
                        a && a.split(" ").forEach((e) => t.classList.remove(e)),
                            o &&
                                o.split(" ").forEach((e) => t.classList.add(e));
                    });
                });
            }, 100);
    }),
    (() => {
        var e = document.getElementById("eCommerceCategoryListForm");
        FormValidation.formValidation(e, {
            fields: {
                categoryTitle: {
                    validators: {
                        notEmpty: {message: "Please enter category title"},
                    },
                },
                slug: {validators: {notEmpty: {message: "Please enter slug"}}},
            },
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap5: new FormValidation.plugins.Bootstrap5({
                    eleValidClass: "is-valid",
                    rowSelector: function (e, t) {
                        return ".form-control-validation";
                    },
                }),
                submitButton: new FormValidation.plugins.SubmitButton(),
                autoFocus: new FormValidation.plugins.AutoFocus(),
            },
        });
    })();
