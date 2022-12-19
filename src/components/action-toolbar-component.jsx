import React, { useState } from 'react';
import copy from 'copy-to-clipboard';
import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ShowHide from './show-hide-component';
import DeletedList from './delete-list-component';
import { getNestedObject } from '../utils/helper';

const button =
  'bg-white outline outline-offset-0 outline-1 outline-black text-sm rounded-xl px-3 hover:bg-black hover:text-white';

function ActionToolbar(props) {
  const {
    onDownload,
    onDelete,
    copyClipboard,
    onShowHideColumn,
    selectedData,
    navTo,
    getToggleHideAllColumnsProps,
    columns,
    copyItem,
    onAdd,
    onEdit,
    displayName,
  } = props;

  const navigate = useNavigate();
  const [onOpen, setOnOpen] = useState(false);
  const [showHide, setShowHide] = useState(false);

  const onCopy = () => {
    let text = '';
    copyItem.forEach(val => {
      text += `${val.Header}\t`;
    });
    selectedData.forEach(i => {
      text += '\n';
      const props = { ...i.original };
      copyItem.forEach(col => {
        const getValue = getNestedObject(props, col.id.split('.'));
        text += `${
          getValue
            ? getValue
                .toString()
                .replace(/(?:\r\n|\r|\n)/gm, '')
                .trim()
            : '-'
        }\t`;
      });
    });
    copy(text, {
      format: 'text/plain',
    });
    const Toast = Swal.mixin({
      toast: true,
      width: '18%',
      position: 'top-end',
      showConfirmButton: false,
      background: '#FFC000',
      padding: '1 0',
      timer: 3000,
      timerProgressBar: true,
      didOpen: toast => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: 'warning',
      iconColor: '#998032',
      title: '<h5>Copy to Clipboard</h5>',
    });
  };

  return (
    <div className="flex gap-4 bg-white py-3 px-6 rounded-t-3xl">
      {onAdd && (
        <Button
          type="button"
          onClick={() => navigate(`${navTo?.path}/add`)}
          className="bg-[#232323] outline outline-offset-0 outline-1 outline-black text-sm rounded-xl px-4 text-white hover:bg-black"
        >
          + Add {displayName}
        </Button>
      )}
      {onDownload && (
        <Button className={button} onClick={onDownload}>
          Save to Excel
        </Button>
      )}
      {onEdit && (
        <Button
          className={button}
          onClick={() => navigate(`${navTo?.path}/${selectedData?.find(i => i).original.id}/edit`)}
          disabled={selectedData.length !== 1}
        >
          Update
        </Button>
      )}
      {onDelete && (
        <Button className={button} onClick={() => setOnOpen(!onOpen)} disabled={selectedData.length === 0}>
          Delete
        </Button>
      )}

      {copyClipboard && (
        <Button className={button} onClick={onCopy} disabled={selectedData.length === 0}>
          Copy to Clipboard
        </Button>
      )}
      {onShowHideColumn && (
        <>
          <Button className={button} onClick={() => setShowHide(!showHide)}>
            Show / Hide Column(s)
          </Button>
          <ShowHide
            getToggleHideAllColumnsProps={getToggleHideAllColumnsProps}
            visible={showHide}
            columns={columns.filter(i => i.id !== 'selection')}
            onClose={() => setShowHide(!showHide)}
          />
        </>
      )}
      {onOpen && (
        <div
          className=" main-modal fixed w-full h-200 inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="border shadow-lg modal-container bg-white w-[80%] mx-auto rounded-xl z-50 overflow-y-auto py-4 px-2">
            <div className="modal-content py-4 text-left px-6">
              <div className="flex justify-between items-center pb-3">
                <p className="text-MD font-bold">Are you sure to delete this data ?</p>
                <div className="flex-1" />
                <Button
                  className="rounded-full bg-[#aaa] outline outline-offset-0 outline-[#1F2022] text-[#fff] font-bold"
                  onClick={() => setOnOpen(!onOpen)}
                  px={8}
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  className="ml-4 rounded-full outline outline-offset-0 outline-[#232323] bg-[#232323] text-[#fff] font-bold"
                  px={8}
                  size="sm"
                  onClick={() => {
                    onDelete();
                    setOnOpen(!onOpen);
                  }}
                >
                  Delete
                </Button>
              </div>
              <div className={`my-5 ${selectedData.length > 5 ? 'overflow-y-auto' : ''} flex justify-center `}>
                <DeletedList datas={selectedData} columnsData={columns} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActionToolbar;
