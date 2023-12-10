import React, { useState } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

interface PasswordComponentProps {
  open: boolean;
  onSend: (pass: string) => void;
  onClose: () => void;
}

const PasswordComponent: React.FC<PasswordComponentProps> = ({
  open,
  onClose,
  onSend,
}) => {
  const [password, setPassword] = useState("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSendPassword = async () => {
    onSend(password);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Password Popup</DialogTitle>
      <DialogContent>
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSendPassword} color="primary">
          Send Password
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordComponent;
