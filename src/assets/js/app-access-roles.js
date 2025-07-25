document.addEventListener("DOMContentLoaded", function (e) {
    let t = document.querySelector(".datatables-users"),
        n = {
            1: {title: "Pending", class: "bg-label-warning"},
            2: {title: "Active", class: "bg-label-success"},
            3: {title: "Inactive", class: "bg-label-secondary"},
        },
        a,
        l = "app-user-view-account.html";
    if (t) {
        let e = document.createElement("div");
        e.classList.add("user_role");
        var s = document.createElement("div");
        function r(e) {
            let t = document.querySelector(".dtr-expanded");
            (t = e ? e.target.parentElement.closest("tr") : t) &&
                a.row(t).remove().draw();
        }
        function c() {
            var e = document.querySelector(".datatables-users");
            let t = document.querySelector(".dtr-bs-modal");
            e && e.classList.contains("collapsed")
                ? t &&
                  t.addEventListener("click", function (e) {
                      e.target.parentElement.classList.contains(
                          "delete-record",
                      ) &&
                          (r(), (e = t.querySelector(".btn-close"))) &&
                          e.click();
                  })
                : (e = e?.querySelector("tbody")) &&
                  e.addEventListener("click", function (e) {
                      e.target.parentElement.classList.contains(
                          "delete-record",
                      ) && r(e);
                  });
        }
        s.classList.add("user_plan"),
            (a = new DataTable(t, {
                ajax: assetsPath + "json/user-list.json",
                columns: [
                    {data: "id"},
                    {
                        data: "id",
                        orderable: !1,
                        render: DataTable.render.select(),
                    },
                    {data: "full_name"},
                    {data: "role"},
                    {data: "current_plan"},
                    {data: "billing"},
                    {data: "status"},
                    {data: "id"},
                ],
                columnDefs: [
                    {
                        className: "control",
                        orderable: !1,
                        searchable: !1,
                        responsivePriority: 5,
                        targets: 0,
                        render: function (e, t, a, s) {
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
                        render: function (e, t, a, s) {
                            var n = a.full_name,
                                r = a.email,
                                a = a.avatar;
                            let c;
                            return `
              <div class="d-flex justify-content-left align-items-center">
                <div class="avatar-wrapper">
                  <div class="avatar avatar-sm me-4">
                    ${(c = a ? `<img src="${assetsPath}img/avatars/${a}" alt="Avatar" class="rounded-circle">` : `<span class="avatar-initial rounded-circle bg-label-${["success", "danger", "warning", "info", "dark", "primary", "secondary"][Math.floor(6 * Math.random()) + 1]}">${(n.match(/\b\w/g) || []).slice(0, 2).join("").toUpperCase()}</span>`)}
                  </div>
                </div>
                <div class="d-flex flex-column">
                  <a href="${l}" class="text-heading text-truncate"><span class="fw-medium">${n}</span></a>
                  <small>@${r}</small>
                </div>
              </div>
            `;
                        },
                    },
                    {
                        targets: 3,
                        render: function (e, t, a, s) {
                            a = a.role;
                            return `<span class='text-truncate d-flex align-items-center text-heading'>${{Subscriber: '<i class="icon-base bx bx-crown text-primary me-2"></i>', Author: '<i class="icon-base bx bx-edit text-warning me-2"></i>', Maintainer: '<i class="icon-base bx bx-user text-success me-2"></i>', Editor: '<i class="icon-base bx bx-pie-chart-alt text-info me-2"></i>', Admin: '<i class="icon-base bx bx-desktop text-danger me-2"></i>'}[a] || ""}${a}</span>`;
                        },
                    },
                    {
                        targets: 4,
                        render: function (e, t, a, s) {
                            return (
                                '<span class="fw-medium">' +
                                a.current_plan +
                                "</span>"
                            );
                        },
                    },
                    {
                        targets: 6,
                        render: function (e, t, a, s) {
                            a = a.status;
                            return (
                                '<span class="badge ' +
                                n[a].class +
                                '" text-capitalized>' +
                                n[a].title +
                                "</span>"
                            );
                        },
                    },
                    {
                        targets: -1,
                        title: "Actions",
                        searchable: !1,
                        orderable: !1,
                        render: function (e, t, a, s) {
                            return `
              <div class="d-flex align-items-center">
                <a href="javascript:;" class="btn btn-icon delete-record"><i class="icon-base bx bx-trash icon-md"></i></a>
                <a href="${l}" class="btn btn-icon"><i class="icon-base bx bx-show icon-md"></i></a>
                <a href="javascript:;" class="btn btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="icon-base bx bx-dots-vertical-rounded icon-md"></i></a>
                <div class="dropdown-menu dropdown-menu-end m-0">
                  <a href="javascript:;" class="dropdown-item">Edit</a>
                  <a href="javascript:;" class="dropdown-item">Suspend</a>
                </div>
              </div>
            `;
                        },
                    },
                ],
                select: {style: "multi", selector: "td:nth-child(2)"},
                order: [[2, "desc"]],
                layout: {
                    topStart: {
                        rowClass: "row me-3 ms-2 justify-content-between",
                        features: [
                            {
                                pageLength: {
                                    menu: [10, 25, 50, 100],
                                    text: "_MENU_",
                                },
                            },
                        ],
                    },
                    topEnd: {
                        features: [
                            {
                                search: {
                                    placeholder: "Search User",
                                    text: "_INPUT_",
                                },
                            },
                            e,
                            s,
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
                                return "Details of " + e.data().full_name;
                            },
                        }),
                        type: "column",
                        renderer: function (e, t, a) {
                            var s,
                                n,
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
                                ((s =
                                    document.createElement(
                                        "div",
                                    )).classList.add("table-responsive"),
                                (n = document.createElement("table")),
                                s.appendChild(n),
                                n.classList.add("table"),
                                ((r =
                                    document.createElement("tbody")).innerHTML =
                                    a),
                                n.appendChild(r),
                                s)
                            );
                        },
                    },
                },
                initComplete: function () {
                    this.api()
                        .columns(3)
                        .every(function () {
                            let t = this,
                                a = document.createElement("select");
                            (a.id = "UserRole"),
                                (a.className = "form-select text-capitalize"),
                                (a.innerHTML =
                                    '<option value=""> Select Role </option>'),
                                e.appendChild(a),
                                a.addEventListener("change", function () {
                                    var e = a.value;
                                    t.search(
                                        e ? "^" + e + "$" : "",
                                        !0,
                                        !1,
                                    ).draw();
                                }),
                                t
                                    .data()
                                    .unique()
                                    .sort()
                                    .each(function (e) {
                                        var t =
                                            document.createElement("option");
                                        (t.value = e),
                                            (t.className = "text-capitalize"),
                                            (t.textContent = e),
                                            a.appendChild(t);
                                    });
                        }),
                        this.api()
                            .columns(4)
                            .every(function () {
                                var t = this,
                                    a = $(
                                        '<select id="Userplan" class="form-select text-capitalize"><option value=""> Select Plan </option></select>',
                                    )
                                        .appendTo(".user_plan")
                                        .on("change", function () {
                                            var e =
                                                $.fn.dataTable.util.escapeRegex(
                                                    $(this).val(),
                                                );
                                            t.search(
                                                e ? "^" + e + "$" : "",
                                                !0,
                                                !1,
                                            ).draw();
                                        });
                                t.data()
                                    .unique()
                                    .sort()
                                    .each(function (e, t) {
                                        a.append(
                                            '<option value="' +
                                                e +
                                                '" class="text-capitalize">' +
                                                e +
                                                "</option>",
                                        );
                                    });
                            });
                },
            })),
            c(),
            document.addEventListener("show.bs.modal", function (e) {
                e.target.classList.contains("dtr-bs-modal") && c();
            }),
            document.addEventListener("hide.bs.modal", function (e) {
                e.target.classList.contains("dtr-bs-modal") && c();
            });
    }
    setTimeout(() => {
        [
            {
                selector: ".dt-search .form-control",
                classToRemove: "form-control-sm",
            },
            {selector: ".dt-search", classToAdd: "mb-md-6 mb-2"},
            {
                selector: ".dt-length .form-select",
                classToRemove: "form-select-sm",
            },
            {selector: ".dt-length", classToAdd: "mb-md-6 mb-0"},
            {selector: ".dt-layout-start", classToAdd: "ps-2 mt-0"},
            {
                selector: ".dt-layout-end",
                classToRemove: "justify-content-between",
                classToAdd:
                    "justify-content-md-between justify-content-center d-flex flex-wrap gap-4 mb-sm-0 mb-4 mt-0",
            },
            {selector: ".dt-layout-table", classToRemove: "row mt-2"},
            {selector: ".user_role", classToAdd: "w-px-200 my-md-0 mt-6 mb-2"},
            {selector: ".user_plan", classToAdd: "w-px-200 mb-6 mb-md-0"},
        ].forEach(({selector: e, classToRemove: a, classToAdd: s}) => {
            document.querySelectorAll(e).forEach((t) => {
                a && a.split(" ").forEach((e) => t.classList.remove(e)),
                    s && s.split(" ").forEach((e) => t.classList.add(e));
            });
        });
    }, 100);
    var s = document.querySelectorAll(".role-edit-modal"),
        o = document.querySelector(".add-new-role"),
        i = document.querySelector(".role-title");
    (o.onclick = function () {
        i.innerHTML = "Add New Role";
    }),
        s &&
            s.forEach(function (e) {
                e.onclick = function () {
                    i.innerHTML = "Edit Role";
                };
            });
});
