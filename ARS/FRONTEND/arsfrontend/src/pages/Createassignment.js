import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  Snackbar,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Fade from "@mui/material/Fade";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateAssignmentForm() {
  const navigate = useNavigate();
  const [state, setState] = useState({
    open: false,
    message: "",
    Transition: Fade,
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedDate: "",
    dueDate: "",
    subtasks: [],
  });

  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubtaskChange = (index, e) => {
    const newSubtasks = [...form.subtasks];
    newSubtasks[index][e.target.name] = e.target.value;
    setForm({ ...form, subtasks: newSubtasks });
  };

  const addSubtask = () => {
    setForm({
      ...form,
      subtasks: [...form.subtasks, { title: "", description: "" }],
    });
  };

  const handleSnackbarClose = () => {
    setState((prev) => ({ ...prev, open: false }));
  };

  const handleSubmit = async () => {
    // Validate required fields first
    const { title, description, assignedDate, dueDate, subtasks } = form;

    if (!title.trim() || !description.trim() || !assignedDate || !dueDate) {
      setState({
        open: true,
        message: "Title, Description, Assigned Date, and Due Date are required",
      });
      return;
    }

    const cleanedSubtasks = subtasks.filter(
      (s) => s.title.trim() && s.description.trim()
    );

    setSubmitting(true);

    try {
      const response = await axios.post("/assignment/create", {
        title: title.trim(),
        description: description.trim(),
        assignedDate,
        dueDate,
        subtasks: cleanedSubtasks,
      });

      setState({
        open: true,
        message: response.data.message || "Assignment created successfully",
      });

      // Navigate after a short delay to allow snackbar to show
      setTimeout(() => {
        navigate("/profile/user");
      }, 1500);
    } catch (error) {
      setState({
        open: true,
        message:
          error.response?.data?.error || "Failed to create assignment",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#121212",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Snackbar
        open={state.open}
        onClose={handleSnackbarClose}
        message={state.message}
        // key={state.Transition.name}
        autoHideDuration={3000}
      />

      <Box
        sx={{
          width: 750,
          padding: 4,
          backgroundColor: "#1e1e1e",
          borderRadius: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: 36,
            fontWeight: 700,
            color: "#fff",
            textAlign: "center",
            mb: 3,
          }}
        >
          Create Assignment
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="title"
              label="Title"
              value={form.title}
              onChange={handleInputChange}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="description"
              label="Description"
              value={form.description}
              onChange={handleInputChange}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="assignedDate"
              label="Assigned Date"
              type="datetime-local"
              
              value={form.assignedDate}
              onChange={handleInputChange}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              name="dueDate"
              label="Due Date"
              type="datetime-local"
              
              value={form.dueDate}
              onChange={handleInputChange}
              sx={textFieldStyles}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography sx={{ fontSize: 20, fontWeight: 600, color: "#fff" }}>
              Subtasks
            </Typography>
            <IconButton onClick={addSubtask} color="primary" sx={{ ml: 1 }}>
              <AddIcon sx={{ color: "#ff8c00" }} />
            </IconButton>
          </Box>

          {form.subtasks.length === 0 && (
            <Typography sx={{ color: "#aaa", mb: 2 }}>
              No subtasks added yet.
            </Typography>
          )}

          {form.subtasks.map((subtask, index) => (
            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name="title"
                  label={`Subtask Title ${index + 1}`}
                  value={subtask.title}
                  onChange={(e) => handleSubtaskChange(index, e)}
                  sx={textFieldStyles}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name="description"
                  label={`Subtask Description ${index + 1}`}
                  value={subtask.description}
                  onChange={(e) => handleSubtaskChange(index, e)}
                  sx={textFieldStyles}
                />
              </Grid>
            </Grid>
          ))}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
            sx={{
              bgcolor: "#ff8c00",
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
              "&:hover": { bgcolor: "#ffa733" },
            }}
          >
            {submitting ? "Creating..." : "Create Assignment"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

const textFieldStyles = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#ff8c00",
    },
    "&:hover fieldset": {
      borderColor: "#ffa733",
    },
    "&.Mui-focused": {
      backgroundColor: "#2c2c2c",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#ff8c00",
    },
    "& input": {
      color: "#fff",
    },
  },
  "& label": {
    color: "#ff8c00",
  },
  "& label.Mui-focused": {
    color: "#ff8c00",
  },
};

export default CreateAssignmentForm;
