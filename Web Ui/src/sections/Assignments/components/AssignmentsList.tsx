import { useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import AssignmentsRepository from "../../../modules/Assignments/repository/AssignmentsRepository";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Container,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";
import { AssignmentDataObject } from "../../../modules/Assignments/domain/assignmentInterfaces";
import AddIcon from "@mui/icons-material/Add";
import { DeleteAssignment } from "../../../modules/Assignments/application/DeleteAssignment";
import { ConfirmationDialog } from "../../Shared/Components/ConfirmationDialog";
import { ValidationDialog } from "../../Shared/Components/ValidationDialog";
import Assignment from "./Assignment";
import SortingComponent from "../../GeneralPurposeComponents/SortingComponent";
import GroupFilter from "./GroupFilter";
import { GroupDataObject } from "../../../modules/Groups/domain/GroupInterface";
import { SelectChangeEvent } from "@mui/material";
import GroupsRepository from "../../../modules/Groups/repository/GroupsRepository";
import GetGroups from "../../../modules/Groups/application/GetGroups";
import { useGlobalState } from "../../../modules/User-Authentication/domain/authStates";
import { updateGroupOnDb } from "../../../modules/User-Authentication/application/updateGroup";
import { adaptarDatos } from "../../../utils/adaptarDatos";


const StyledTable = styled(Table)({
  width: "82%",
  marginLeft: "auto",
  marginRight: "auto",
});
const ButtonContainer = styled("div")({
  display: "flex",
  justifyContent: "flex-end",
  gap: "8px",
});

const CustomTableCell1 = styled(TableCell)({
  width: "80%",
});

const CustomTableCell2 = styled(TableCell)({
  width: "10%",
});

interface AssignmentsProps {
  ShowForm: () => void;
  userRole: string;
  userGroupid: number;
}

function Assignments({
  ShowForm: showForm,
  userRole,
  userGroupid,
}: Readonly<AssignmentsProps>) {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [selectedSorting, setSelectedSorting] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<number>(0);
 
  const [selectedAssignmentIndex, setSelectedAssignmentIndex] = useState<
    number | null
  >(null);
  const navigate = useNavigate();

  const [, setHoveredRow] = useState<number | null>(null);
  const [assignments, setAssignments] = useState<AssignmentDataObject[]>([]);
  const assignmentsRepository = new AssignmentsRepository();

  const deleteAssignment = new DeleteAssignment(assignmentsRepository);

  const [groupList, setGroupList] = useState<GroupDataObject[]>([]);
  const groupRepository = new GroupsRepository();
  const getGroups = new GetGroups(groupRepository);
  const [authData, setAuthData] = useGlobalState("authData");


  const orderAssignments = (
    assignmentsArray: AssignmentDataObject[],
    selectedSorting: string
  ) => {
    if (assignmentsArray.length == 0) {
      return;
    }
    if (selectedSorting === "A_Up_Order") {
      assignmentsArray.sort((a, b) => a.title.localeCompare(b.title));
    } else if (selectedSorting === "A_Down_Order") {
      assignmentsArray.sort((a, b) => b.title.localeCompare(a.title));
    } else if (selectedSorting === "Time_Up") {
      assignmentsArray.sort((a, b) => b.id - a.id);
    } else if (selectedSorting === "Time_Down") {
      assignmentsArray.sort((a, b) => a.id - b.id);
    }
    setAssignments(assignmentsArray);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allGroups = await getGroups.getGroups();
        setGroupList(allGroups);
        console.log("groups", allGroups);
        console.log("Asi inicia mi factor de authenticacion", authData);
        const savedSelectedGroup = authData?.usergroupid; // Usar el operador de opcionalidad (?)
        console.log("grupos seleccionados de grupo seleccionado no filtro", savedSelectedGroup);
        const selectedGroup = allGroups.find((group) => group.id === savedSelectedGroup);
        if (selectedGroup && selectedGroup.id !== undefined) {
          setSelectedGroup(selectedGroup.id);
        }
  setAssignments(assignments);
        orderAssignments([...assignments], selectedSorting);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };
    fetchData();
  },);

  const handleOrderAssignments = (event: { target: { value: string } }) => {
    setSelectedSorting(event.target.value as string);
    orderAssignments([...assignments], event.target.value);
  };

  const handleGroupChange = async (event: SelectChangeEvent<number>) => {
    const groupId = event.target.value as number;
    console.log("Obtengo el id del filtro", groupId);
    setSelectedGroup(groupId);
    const updatedAuthData = { ...authData, usergroupid: groupId };
    console.log("guardo en auth", updatedAuthData);
    setAuthData(updatedAuthData); // Actualiza el estado de authData
    const datosParaGuardar = adaptarDatos(updatedAuthData);
    updateGroupOnDb(datosParaGuardar);
    console.log("en user actualizando", updatedAuthData); // Muestra el valor actualizado de authData
  
    try {
      const updatedGroupId = updatedAuthData.usergroupid; // Usa el valor actualizado de usergroupid
      if (updatedGroupId !== undefined) {
        const assignments = await assignmentsRepository.getAssignmentsByGroupid(updatedGroupId);
        console.log("mis tareas recuperadas", assignments);
        setAssignments(assignments);
      } else {
        const assignments = await assignmentsRepository.getAssignments();
        setAssignments(assignments);
      }
    } catch (error) {
      console.error("Error fetching assignments by group ID:", error);
    }
  };
  

 
  const filteredAssignments = selectedGroup

  ? assignments.filter((assignment) => assignment.groupid === selectedGroup)
  : assignments;

  const handleClickDetail = (index: number) => {
    navigate(`/assignment/${filteredAssignments[index].id}`);
};

  const handleClickDelete = (index: number) => {
    const assignmentToDelete = filteredAssignments[index];
    const originalIndex = assignments.indexOf(assignmentToDelete);
    setSelectedAssignmentIndex(originalIndex);
    setConfirmationOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    try {
      if (
        selectedAssignmentIndex !== null &&
        assignments[selectedAssignmentIndex]
      ) {
        console.log(
          "ID de la tarea a eliminar:",
          assignments[selectedAssignmentIndex].id,
        );
        await deleteAssignment.deleteAssignment(
          assignments[selectedAssignmentIndex].id,
        );
        const updatedAssignments = [...assignments];
        updatedAssignments.splice(selectedAssignmentIndex, 1);
        setAssignments(updatedAssignments);
      }
      setConfirmationOpen(false);
    } catch (error) {
      console.error(error);
    }
    setValidationDialogOpen(true);
    setConfirmationOpen(false);
  };
  const handleRowHover = (index: number | null) => {
    setHoveredRow(index);
  };

  return (
    <Container>
      <section className="Tareas">
        <StyledTable>
          <TableHead>
            <TableRow 
            sx={{ 
              borderBottom: "2px solid #E7E7E7" 
            }}
            >
              <CustomTableCell1
                sx={{ fontWeight: 560, color: "#333", fontSize: "1rem" }}
              >
                Tareas
              </CustomTableCell1>
              <CustomTableCell2>
                <ButtonContainer>
                {userRole !== "student" && groupList.length > 0 ?(  
                  <GroupFilter
                    selectedGroup={selectedGroup}
                    groupList={groupList}
                    onChangeHandler={handleGroupChange}
                    defaultName={groupList.find(group => group.id === userGroupid)?.groupName || "Selecciona un grupo"}
                  />
                ):(
                  <span>{groupList.find(group => group.id === userGroupid)?.groupName || "No hay grupos disponibles"}</span>
                  )}

                  <SortingComponent
                    selectedSorting={selectedSorting}
                    onChangeHandler={handleOrderAssignments}
                  />
                  {userRole !== "student" && (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon />}
                      sx={{
                        borderRadius: "17px",
                        textTransform: "none",
                        fontSize: "0.95rem",
                      }}
                      onClick={showForm}
                    >
                      Crear
                    </Button>
                  )}
                </ButtonContainer>
              </CustomTableCell2>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssignments.map((assignment, index) => (
              <Assignment
                key={assignment.id}
                assignment={assignment}
                index={index}
                handleClickDetail={handleClickDetail}
                handleClickDelete={handleClickDelete}
                handleRowHover={handleRowHover}
                role={userRole}
              />
            ))}
          </TableBody>
        </StyledTable>
        {confirmationOpen && (
          <ConfirmationDialog
            open={confirmationOpen}
            title="¿Eliminar la tarea?"
            content={
              <>
                Ten en cuenta que esta acción tambien eliminará <br /> todas las
                entregas asociadas.
              </>
            }
            cancelText="Cancelar"
            deleteText="Eliminar"
            onCancel={() => setConfirmationOpen(false)}
            onDelete={handleConfirmDelete}
          />
        )}
        {validationDialogOpen && (
          <ValidationDialog
            open={validationDialogOpen}
            title="Tarea eliminada exitosamente"
            closeText="Cerrar"
            onClose={() => window.location.reload()}
          />
        )}
      </section>
    </Container>
  );
}

export default Assignments;
