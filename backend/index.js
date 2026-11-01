const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { supabase } = require("./supabase");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Blood Donation Management System API is running!" });
});

app.get("/api/test-db", async (req, res) => {
  const { data, error } = await supabase
    .from("blood_groups")
    .select("*")
    .limit(1);

  if (error) {
    console.error("Supabase test failed:", error.message);
    return res.status(500).json({ error: error.message });
  }

  res.json({ message: "Supabase connected successfully!", data });
});

app.get("/api/blood-requests", async (req, res) => {
  const { data, error } = await supabase
    .from("blood_requests")
    .select(`
      id,
      patient_name,
      units_required,
      urgency,
      required_date,
      status,
      hospitals ( name ),
      blood_groups ( name )
    `)
    .order("request_date", { ascending: false });

  if (error) {
    console.error("Failed to fetch blood requests:", error.message);
    return res.status(500).json({ error: error.message });
  }

  const requests = data.map((request) => ({
    id: request.id,
    patient: request.patient_name,
    hospital: request.hospitals?.name || "Unknown Hospital",
    bloodGroup: request.blood_groups?.name || "Unknown",
    component: "Whole Blood",
    units: request.units_required,
    urgency:
      request.urgency === "critical"
        ? "Emergency"
        : request.urgency.charAt(0).toUpperCase() +
          request.urgency.slice(1),
    requiredDate: request.required_date || "",
    status:
      request.status.charAt(0).toUpperCase() +
      request.status.slice(1),
  }));

  res.json(requests);
});

app.post("/api/blood-requests", async (req, res) => {
  try {
    const {
      patient_name,
      hospital_name,
      blood_group_name,
      units_required,
      urgency,
      required_date,
    } = req.body;

    if (
      !patient_name ||
      !hospital_name ||
      !blood_group_name ||
      !required_date ||
      !Number.isInteger(Number(units_required)) ||
      Number(units_required) < 1
    ) {
      return res.status(400).json({
        error: "Please provide valid request details.",
      });
    }

    // Find the hospital ID
    const { data: hospital, error: hospitalError } =
      await supabase
        .from("hospitals")
        .select("id")
        .eq("name", hospital_name)
        .single();

    if (hospitalError || !hospital) {
      return res.status(400).json({
        error: "Hospital not found in the database.",
      });
    }

    // Find the blood group ID
    const { data: bloodGroup, error: bloodGroupError } =
      await supabase
        .from("blood_groups")
        .select("id")
        .eq("name", blood_group_name)
        .single();

    if (bloodGroupError || !bloodGroup) {
      return res.status(400).json({
        error: "Blood group not found in the database.",
      });
    }

    // Save the request
    const urgencyValue = {
      Normal: "normal",
      Urgent: "urgent",
      Emergency: "critical",
    }[urgency];

    if (!urgencyValue) {
      return res.status(400).json({
        error: "Invalid urgency value.",
      });
    }

    const { data, error } = await supabase
      .from("blood_requests")
      .insert({
        patient_name,
        hospital_id: hospital.id,
        blood_group_id: bloodGroup.id,
        units_required: Number(units_required),
        urgency: urgencyValue,
        required_date,
        status: "pending",
      })
      .select(`
        id,
        patient_name,
        units_required,
        urgency,
        required_date,
        status,
        hospitals ( name ),
        blood_groups ( name )
      `)
      .single();

    if (error) throw error;

    res.status(201).json({
      id: data.id,
      patient: data.patient_name,
      hospital: data.hospitals?.name || "Unknown Hospital",
      bloodGroup: data.blood_groups?.name || "Unknown",
      component: "Whole Blood",
      units: data.units_required,
      urgency:
        data.urgency === "critical"
          ? "Emergency"
          : data.urgency.charAt(0).toUpperCase() +
            data.urgency.slice(1),
      requiredDate: data.required_date || "",
      status:
        data.status.charAt(0).toUpperCase() +
        data.status.slice(1),
    });
  } catch (error) {
    console.error("Failed to create blood request:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/blood-requests/:id", async (req, res) => {
  try {
    const statusMap = {
      Approved: "approved",
      Issued: "issued",
    };

    const status = statusMap[req.body.status];

    if (!status) {
      return res.status(400).json({
        error: "Invalid status.",
      });
    }

    const { data, error } = await supabase
      .from("blood_requests")
      .update({ status })
      .eq("id", req.params.id)
      .select("id, status")
      .single();

    if (error) throw error;

    res.json({
      id: data.id,
      status:
        data.status.charAt(0).toUpperCase() +
        data.status.slice(1),
    });
  } catch (error) {
    console.error("Failed to update request:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
