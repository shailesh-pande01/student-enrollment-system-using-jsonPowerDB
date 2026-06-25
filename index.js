/*==============================================================
  Student Enrollment Form  |  index.js
  JSONPowerDB REST API
  Database  : SCHOOL-DB
  Relation  : STUDENT-TABLE
  Fields    : Roll-No, Full-Name, Class, Birth-Date,
              Address, Enrollment-Date
==============================================================*/

// ── DB Configuration ─────────────────────────────────────
var connToken = "90935105|-31949240746478821|90903666";   // keep unchanged
var dbName    = "SCHOOL-DB";
var relName   = "STUDENT-TABLE";
var baseUrl   = "http://api.login2explore.com:5577";       // FIX: correct host

// Holds the internal JPDB record number needed by UPDATE
var recNo = "";

// ─────────────────────────────────────────────────────────
// PAGE LOAD
// ─────────────────────────────────────────────────────────
$(document).ready(function () {
    resetForm();

    // Enter key in Roll No field triggers search
    $("#rollNo").on("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            searchStudent();
        }
    });

    // Search button
    $("#searchBtn").on("click", function () {
        searchStudent();
    });
});

// ─────────────────────────────────────────────────────────
// REQUEST BUILDERS  — same string-concatenation pattern as
// the working example's createPUTRequest / executeCommand
// ─────────────────────────────────────────────────────────
function createGET_BY_KEYRequest(connToken, dbName, relName, jsonStr) {
    return "{\n"
        + "\"token\" : \""  + connToken + "\","
        + "\"dbName\": \""  + dbName    + "\",\n"
        + "\"cmd\" : \"GET_BY_KEY\",\n"
        + "\"rel\" : \""    + relName   + "\","
        + "\"jsonStr\": \n" + jsonStr   + "\n"
        + "}";
}

function createPUTRequest(connToken, jsonStr, dbName, relName) {
    return "{\n"
        + "\"token\" : \""  + connToken + "\","
        + "\"dbName\": \""  + dbName    + "\",\n"
        + "\"cmd\" : \"PUT\",\n"
        + "\"rel\" : \""    + relName   + "\","
        + "\"jsonStr\": \n" + jsonStr   + "\n"
        + "}";
}

function createUPDATERecordRequest(connToken, jsonStr, dbName, relName, recNo) {
    return "{\n"
        + "\"token\" : \""  + connToken + "\","
        + "\"dbName\": \""  + dbName    + "\",\n"
        + "\"cmd\" : \"UPDATE\",\n"
        + "\"rel\" : \""    + relName   + "\","
        + "\"record_no\": " + recNo     + ","
        + "\"jsonStr\": \n" + jsonStr   + "\n"
        + "}";
}

// Identical to executeCommand in the working example
function executeCommand(reqString, dbBaseUrl, apiEndPointUrl) {
    var url = dbBaseUrl + apiEndPointUrl;
    var jsonObj;
    $.post(url, reqString, function (result) {
        jsonObj = JSON.parse(result);
    }).fail(function (result) {
        jsonObj = JSON.parse(result.responseText);
    });
    return jsonObj;
}

// ─────────────────────────────────────────────────────────
// RESET
// ─────────────────────────────────────────────────────────
function resetForm() {
    $("#rollNo, #fullName, #stdClass, #birthDate, #address, #enrollmentDate").val("");
    $("#rollNo").prop("disabled", false);
    $("#fullName, #stdClass, #birthDate, #address, #enrollmentDate").prop("disabled", true);
    $("#searchBtn").prop("disabled", false);
    $("#saveBtn, #updateBtn, #resetBtn").prop("disabled", true);
    recNo = "";
    hideMsg();
    setTimeout(function () { $("#rollNo").focus(); }, 100);
}

// ─────────────────────────────────────────────────────────
// SEARCH  —  GET_BY_KEY on /api/irl  (read endpoint)
// ─────────────────────────────────────────────────────────
function searchStudent() {
    var rollNoVar = $("#rollNo").val().trim();
    if (rollNoVar === "") {
        alert("Please enter a Roll No first.");
        $("#rollNo").focus();
        return;
    }

    var jsonStr   = JSON.stringify({ "Roll-No": rollNoVar });
    var getReqStr = createGET_BY_KEYRequest(connToken, dbName, relName, jsonStr);

    jQuery.ajaxSetup({ async: false });                             // synchronous like working example
    var resultObj = executeCommand(getReqStr, baseUrl, "/api/irl"); // FIX: correct read endpoint
    jQuery.ajaxSetup({ async: true });

    if (resultObj === undefined) {
        alert("Error: Could not connect to the database. Check your network.");
        return;
    }

    if (resultObj.status === 400) {
        // Roll No not in DB → new record
        showMsg("New Roll No detected. Fill in the form and click Save.", "primary");
        activateSaveMode();

    } else if (resultObj.status === 200) {
        // Roll No exists → load record, switch to Update mode
        var data = JSON.parse(resultObj.data);
        recNo = data.rec_id;
        fillForm(data.record);
        showMsg("Record found! Edit the fields below and click Update.", "warning");
        activateUpdateMode();

    } else {
        alert("DB Error: " + (resultObj.message || JSON.stringify(resultObj)));
    }
}

// ─────────────────────────────────────────────────────────
// FILL FORM  (used when a record is found)
// ─────────────────────────────────────────────────────────
function fillForm(student) {
    $("#fullName").val(student["Full-Name"]             || "");
    $("#stdClass").val(student["Class"]                 || "");
    $("#birthDate").val(student["Birth-Date"]           || "");
    $("#address").val(student["Address"]                || "");
    $("#enrollmentDate").val(student["Enrollment-Date"] || "");
}

// ─────────────────────────────────────────────────────────
// MODE SWITCHERS
// ─────────────────────────────────────────────────────────
function activateSaveMode() {
    $("#fullName, #stdClass, #birthDate, #address, #enrollmentDate").prop("disabled", false);
    $("#searchBtn").prop("disabled", true);
    $("#saveBtn").prop("disabled", false);
    $("#updateBtn").prop("disabled", true);
    $("#resetBtn").prop("disabled", false);
    $("#fullName").focus();
}

function activateUpdateMode() {
    $("#rollNo").prop("disabled", true);
    $("#fullName, #stdClass, #birthDate, #address, #enrollmentDate").prop("disabled", false);
    $("#searchBtn").prop("disabled", true);
    $("#saveBtn").prop("disabled", true);
    $("#updateBtn").prop("disabled", false);
    $("#resetBtn").prop("disabled", false);
    $("#fullName").focus();
}

// ─────────────────────────────────────────────────────────
// SAVE  —  PUT on /api/iml  (write endpoint)
// ─────────────────────────────────────────────────────────
function saveStudent() {
    var rollNoVar = $("#rollNo").val().trim();
    if (rollNoVar === "") {
        alert("Roll No is required!");
        $("#rollNo").focus();
        return;
    }
    var fullNameVar = $("#fullName").val().trim();
    if (fullNameVar === "") {
        alert("Full Name is required!");
        $("#fullName").focus();
        return;
    }
    var classVar = $("#stdClass").val().trim();
    if (classVar === "") {
        alert("Class is required!");
        $("#stdClass").focus();
        return;
    }
    var birthDateVar = $("#birthDate").val();
    if (birthDateVar === "") {
        alert("Birth Date is required!");
        $("#birthDate").focus();
        return;
    }
    var addressVar = $("#address").val().trim();
    if (addressVar === "") {
        alert("Address is required!");
        $("#address").focus();
        return;
    }
    var enrollDateVar = $("#enrollmentDate").val();
    if (enrollDateVar === "") {
        alert("Enrollment Date is required!");
        $("#enrollmentDate").focus();
        return;
    }

    var jsonStr = JSON.stringify({
        "Roll-No":         rollNoVar,
        "Full-Name":       fullNameVar,
        "Class":           classVar,
        "Birth-Date":      birthDateVar,
        "Address":         addressVar,
        "Enrollment-Date": enrollDateVar
    });

    var putReqStr = createPUTRequest(connToken, jsonStr, dbName, relName);

    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommand(putReqStr, baseUrl, "/api/iml");  // FIX: correct write endpoint
    jQuery.ajaxSetup({ async: true });

    if (resultObj.status === 200) {
        alert("Student record saved successfully!");
        resetForm();
    } else {
        alert("Save failed: " + (resultObj.message || JSON.stringify(resultObj)));
    }
}

// ─────────────────────────────────────────────────────────
// UPDATE  —  UPDATE on /api/iml  (write endpoint)
// ─────────────────────────────────────────────────────────
function updateStudent() {
    var fullNameVar = $("#fullName").val().trim();
    if (fullNameVar === "") {
        alert("Full Name is required!");
        $("#fullName").focus();
        return;
    }
    var classVar = $("#stdClass").val().trim();
    if (classVar === "") {
        alert("Class is required!");
        $("#stdClass").focus();
        return;
    }
    var birthDateVar = $("#birthDate").val();
    if (birthDateVar === "") {
        alert("Birth Date is required!");
        $("#birthDate").focus();
        return;
    }
    var addressVar = $("#address").val().trim();
    if (addressVar === "") {
        alert("Address is required!");
        $("#address").focus();
        return;
    }
    var enrollDateVar = $("#enrollmentDate").val();
    if (enrollDateVar === "") {
        alert("Enrollment Date is required!");
        $("#enrollmentDate").focus();
        return;
    }

    var jsonStr = JSON.stringify({
        "Full-Name":       fullNameVar,
        "Class":           classVar,
        "Birth-Date":      birthDateVar,
        "Address":         addressVar,
        "Enrollment-Date": enrollDateVar
    });

    var updateReqStr = createUPDATERecordRequest(connToken, jsonStr, dbName, relName, recNo);

    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommand(updateReqStr, baseUrl, "/api/iml"); // FIX: correct write endpoint
    jQuery.ajaxSetup({ async: true });

    if (resultObj.status === 200) {
        alert("Student record updated successfully!");
        resetForm();
    } else {
        alert("Update failed: " + (resultObj.message || JSON.stringify(resultObj)));
    }
}

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────
function showMsg(text, type) {
    $("#statusMsg")
        .removeClass("d-none alert-success alert-danger alert-warning alert-info alert-primary")
        .addClass("alert-" + type)
        .html(text);
}

function hideMsg() {
    $("#statusMsg").addClass("d-none").html("");
}
