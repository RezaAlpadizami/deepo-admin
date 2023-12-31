import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import Swal from 'sweetalert2';

function DeleteButton(props) {
  const { api, id, redirectTo, text = 'Are you sure want to remove this data ?' } = props;
  const navigate = useNavigate();

  const deleteData = () => {
    Swal.fire({
      title: `Delete Data`,
      text,
      padding: 20,
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonColor: '#EB6058',
      cancelButtonColor: '#FFFFFF',
      confirmButtonText: `<p class="rounded-md bg-[#50B8C1]    text-[#fff] px-5 py-2 ml-5 font-bold">Delete</p>`,
      cancelButtonText: `<p class="rounded-md bg-[#fff] border-2 border-[#50B8C1] text-[#50B8C1] px-5 py-2 font-bold">Cancel</p>`,
      reverseButtons: true,
    }).then(status => {
      if (status.isDismissed) return;
      if (status.isConfirmed) {
        api
          .delete(id)
          .then(() => {
            Swal.fire({ text: 'Data deleted successfully', icon: 'success' });
            navigate(`/${redirectTo}`);
          })
          .catch(error => {
            if (error.code) {
              Swal.fire({ text: 'Something goes wrong', icon: 'error' });
            }
          });
      }
    });
  };
  return (
    <Button
      onClick={deleteData}
      px={8}
      size="sm"
      className="rounded-md border border-[#50B8C1] bg-[#fff] hover:bg-[#E4E4E4] text-[#50B8C1] font-bold"
    >
      Delete
    </Button>
  );
}

export default DeleteButton;
