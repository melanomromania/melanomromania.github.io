$(document).ready(function() {
  function isTnmDataComplete(t, n, m) {
    return t !== "" && n !== "" && m !== "";
  }

  function getStageData(t, n, m) {
    var result = {"number" : -1, "char" : "", "preliminary" : false};

    if (!isTnmDataComplete(t, n, m)) {
      return result;
    }
    if (m.charAt(1) === "1") {
      return {"number" : 4, "char" : "", "preliminary" : false};
    }

    switch (true) {
    case (t === "T1a" || t === "T1b") && (n === "N0" || n === "Nx"):
      result = {"number" : 1, "char" : "A", "preliminary" : false};
      break;
    case (t === "T2a") && (n === "N0" || n === "Nx"):
      result = {"number" : 1, "char" : "B", "preliminary" : false};
      break;
    case (t === "T3a" || t === "T2b") && (n === "N0" || n === "Nx"):
      result = {"number" : 2, "char" : "A", "preliminary" : false};
      break;
    case (t === "T4a" || t === "T3b") && (n === "N0" || n === "Nx"):
      result = {"number" : 2, "char" : "B", "preliminary" : false};
      break;
    case (t === "T4b") && (n === "N0" || n === "Nx"):
      result = {"number" : 2, "char" : "C", "preliminary" : false};
      break;
    case (t.indexOf("T1") !== -1 || t === "T2a") &&
        (n === "N1a" || n === "N2a"):
      result = {"number" : 3, "char" : "A", "preliminary" : false};
      break;
    case (t === "T0" || t === "Tx") &&
        (n === "N1a" || n === "N2a" || n === "N3a"):
      result = {"number" : -1, "char" : "", "preliminary" : false};
      break;
    case (t === "T2b" || t === "T3a") &&
        (n.charAt(1) === "1" || n === "N2a" || n === "N2b"):
      result = {"number" : 3, "char" : "B", "preliminary" : false};
      break;
    case (t === "T0" || t === "Tx") && (n === "N1b" || n === "N1c") ||
        ((t.indexOf("T1") !== -1 || t === "T2a") &&
         (n === "N1b" || n === "N1c" || n === "N2b")):
      result = {"number" : 3, "char" : "B", "preliminary" : false};
      break;
    case (t === "T0" || t === "Tx") &&
        (n === "N2b" || n === "N2c" || n === "N3b" || n === "N3c"):
      result = {"number" : 3, "char" : "C", "preliminary" : false};
      break;
    case (t.charAt(1) === "1" || t.charAt(1) === "2" || t === "T3a") &&
        (n.charAt(1) === "3" || n === "N2c"):
      result = {"number" : 3, "char" : "C", "preliminary" : false};
      break;
    case (t === "T3b" || t === "T4a") && (parseInt(n.charAt(1)) > 0):
      result = {"number" : 3, "char" : "C", "preliminary" : false};
      break;
    case (t === "T4b") &&
        (parseInt(n.charAt(1)) > 0 && parseInt(n.charAt(1)) < 3):
      result = {"number" : 3, "char" : "C", "preliminary" : false};
      break;
    case (t === "T4b") && (parseInt(n.charAt(1)) === 3):
      result = {"number" : 3, "char" : "D", "preliminary" : false};
      break;
    }

    if (n === "Nx" || m === "Mx") {
      result["preliminary"] = true;
    }
    if (t === "Tis") {
      result = {"number" : 0, "char" : "", "preliminary" : false};
    }

    return result;
  }

  function toRomanDigits(value) {
    switch (value) {
    case 0:
      return "0";
    case 1:
      return "I";
    case 2:
      return "II";
    case 3:
      return "III";
    case 4:
      return "IV";
    default:
      return null;
    }
  }

  function getStageText(stage_data) {
    var result = "Nu se poate calcula pe baza datelor introduse";

    if (stage_data["number"] >= 0) {
      result = toRomanDigits(stage_data["number"]);
      result += stage_data["char"];
      result += stage_data["preliminary"] ? "*" : "";
    }

    return result;
  }

  function getClassificationText(t, n, m) {
    var result = "Nu se poate calcula pe baza datelor introduse";

    if (isTnmDataComplete(t, n, m)) {
      result = t + n + m;
    }

    return result;
  }

  function resetTnmData(t, n, m) {
    $("select[name=T]").val(t);
    $("select[name=N]").val(n);
    $("select[name=M]").val(m);
  }

  function updateStageLabel(t, n, m) {
    var stage_data = getStageData(t, n, m);

    $("span[id=stage]").html(getStageText(stage_data));
    $("span[id=tnm]").html(getClassificationText(t, n, m));

    switch (stage_data["number"]) {
    case 0:
      $("span[id=stage]")
          .removeClass("label-warning label-danger label-default")
          .addClass("label-success");
      break;
    case 1:
    case 2:
      $("span[id=stage]")
          .removeClass("label-success label-danger label-default")
          .addClass("label-warning");
      break;
    case 3:
    case 4:
      $("span[id=stage]")
          .removeClass("label-warnning label-success label-default")
          .addClass("label-danger");
      break;
    default:
      $("span[id=stage]")
          .removeClass("label-success label-danger label-warning")
          .addClass("label-default");
    }
  }

  function onTnmDataChanged() {
    resetClinicalData();

    var t = $("select[name=T]").val();
    var n = $("select[name=N]").val();
    var m = $("select[name=M]").val();

    updateStageLabel(t, n, m);
  }

  function resetClinicalData() {
    $("select[name=lymphs], select[name=metastases], select[name=ldh]").val("");
    $("input[id=ulceration]").prop("checked", false);
    $("input[id=breslow]").val(0);
    $("span[id=breslow]").text("0");
  }

  function onBreslowChanged(object) {
    var breslow = object.target.value / 100.0;
    var breslow_text = breslow > 4 ? "> 4.1" : breslow;

    $("span[id=breslow]").text(breslow_text);
    onClinicalDataChanged();
  }

  function onClinicalDataChanged() {
    var breslow = parseFloat($("input[id=breslow]").val() / 100.0);
    var ulceration = $("input[id=ulceration]").is(':checked');

    var t = "";
    switch (true) {
    case breslow > 0 && breslow < 0.8 && !ulceration:
      t = "T1a";
      break;
    case (breslow > 0 && breslow < 0.8 && ulceration) ||
        (breslow >= 0.8 && breslow <= 1):
      t = "T1b";
      break;
    case breslow > 1 && breslow <= 2 && !ulceration:
      t = "T2a";
      break;
    case breslow > 1 && breslow <= 2 && ulceration:
      t = "T2b";
      break;
    case breslow > 2 && breslow <= 4 && !ulceration:
      t = "T3a";
      break;
    case breslow > 2 && breslow <= 4 && ulceration:
      t = "T3b";
      break;
    case breslow > 4 && !ulceration:
      t = "T4a";
      break;
    case breslow > 4 && ulceration:
      t = "T4b";
      break;
    default:
      break;
    }

    var n = $('select[name=lymphs]').val();
    var m = $('select[name=metastases]').val();
    var ldh = $("select[name=ldh]").val();

    t = (t === "" ? "T0" : t);
    n = (n === "" ? "Nx" : n);
    m = (m === "" ? "Mx" : m);
    ldh = (m === "M0" || m === "Mx" ? "" : ldh);

    var m_prime = (ldh === "" ? m : m + "(" + ldh + ")");
    resetTnmData(t, n, m_prime);
    updateStageLabel(t, n, m_prime);
  }

  $("select[name=T], select[name=N], select[name=M]")
      .on("change", onTnmDataChanged);
  $("select[name=lymphs], select[name=metastases], select[name=ldh]")
      .on("change", onClinicalDataChanged);
  $("input[id=ulceration]").on("change", onClinicalDataChanged);
  $("input[id=breslow]").on("input", onBreslowChanged);

  onTnmDataChanged();
});
