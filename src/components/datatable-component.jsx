import React, { useEffect, useState } from 'react';

import XLSX from 'xlsx';
import Moment from 'moment';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { observer } from 'mobx-react-lite';
import { Button, Skeleton, Stack, Fade } from '@chakra-ui/react';
import { useTable, useRowSelect, usePagination, useSortBy } from 'react-table';
import { ChevronLeftIcon, ChevronRightIcon, ArrowSmUpIcon, ArrowSmDownIcon } from '@heroicons/react/solid';

import Input from './input-component';
import Select from './select-component';
import Checkbox from './checkbox-component';
import TableComponent from './table-component';
import DatePicker from './datepicker-component';
import Toolbar from './action-toolbar-component';
import LoadingHover from './loading-hover-component';
import { calculateText, hasProperty } from '../utils/helper';

function DataTable(props) {
  const {
    columns: propsColumn = [],
    limit = 10,
    toolbar,
    to,
    api,
    checkbox,
    displayName,
    name,
    filters,
    identifierProperties = 'id',
  } = props;

  const {
    handleSubmit,
    reset,
    register,
    control,
    formState: { errors },
  } = useForm();

  const [pages, setPages] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [datas, setDatas] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [autoWidth, setAutoWidth] = useState();
  const [loadingHover, setLoadingHover] = useState(false);
  const [loading, setLoading] = useState(false);
  const defaultSort = {
    sort_by: 'id',
    sort_order: 'desc',
  };

  const [filter, setFilter] = useState([]);
  const [filterData, setFilterData] = useState({
    limit: 10,
    offset: 0,
    ...defaultSort,
  });
  useEffect(() => {
    setLastPage(Math.ceil(totalData / limit));
  }, [totalData, limit]);

  const data = React.useMemo(() => datas, [JSON.stringify(datas)]);

  const columns = React.useMemo(
    () =>
      propsColumn.map(d => {
        return {
          Header: d.header,
          accessor: d.value,
          width: d.width,
          Cell: props => {
            const { value, row } = props;
            if (d.type === 'date') {
              return Moment(value).format('DD MMM YYYY');
            }
            if (d.type === 'link' && to) {
              return (
                <Link
                  type="button"
                  className="mr-4 text-blue-500"
                  to={`${to}/${row.original[identifierProperties]}/show`}
                >
                  {value}
                </Link>
              );
            }
            if (d.width === 'auto') {
              setAutoWidth(calculateText(value)[0] / 1.5);

              return calculateText(value)[1];
            }

            return value;
          },
        };
      }),
    [JSON.stringify(propsColumn), to]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    getToggleHideAllColumnsProps,
    allColumns,
  } = useTable({ columns, data }, useSortBy, usePagination, useRowSelect, hooks => {
    if (checkbox) {
      hooks.visibleColumns.push(column => {
        return [
          {
            id: 'selection',
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <Checkbox {...getToggleAllRowsSelectedProps()} style={{ width: '15px', height: '15px' }} />
            ),
            Cell: ({ row }) => (
              <Checkbox {...row.getToggleRowSelectedProps()} style={{ width: '15px', height: '15px' }} />
            ),
          },
          ...column,
        ];
      });
    }
  });

  useEffect(() => {
    getData();
  }, [filterData]);

  const getData = () => {
    setLoading(true);
    api
      .get({ ...filterData })
      .then(res => {
        setLoading(false);
        setDatas(res.data);
        setTotalData(res.query.total);
      })
      .catch(error => {
        setLoading(false);
        Swal.fire({ text: error?.message || error?.originalError, icon: 'error' });
      });
  };

  useEffect(() => {
    if (Array.isArray(filters)) {
      setFilter([...filters]);
    }
  }, [filters]);

  const changePage = page => {
    setPages(page);
    setFilterData({ ...filterData, offset: (page - 1) * limit });
  };

  const isActionToolbarExclude = action => {
    let force = false;
    let exclude = false;
    if (toolbar) {
      if (hasProperty(toolbar, 'action')) {
        force = true;
        if (
          !hasProperty(toolbar.action, action) ||
          (hasProperty(toolbar.action, action) && toolbar.action[action] === false)
        ) {
          exclude = true;
        } else {
          exclude = false;
        }
      }
    }
    return [force, exclude];
  };
  const checkPermissionAction = action => {
    let act;
    switch (action) {
      case 'view':
        act = 'view';
        break;
      case 'delete':
        act = 'delete';
        break;
      case 'save-to-excel':
        act = 'SaveDataToExcel';
        break;
      case 'copy-to-clipboard':
        act = 'CopyToClipboard';
        break;
      case 'show-hide-column':
        act = 'ShowHideColumn';
        break;
      default:
        break;
    }
    return act;
  };

  const enableAction = action => {
    const actions = {
      add: 'add',
      view: 'view',
      edit: 'edit',
      delete: 'delete',
      'save-to-excel': 'download',
      'show-hide-column': 'showHideColumn',
      'copy-to-clipboard': 'copyClipboard',
    };
    if (Object.keys(actions).includes(action)) {
      const [force, status] = isActionToolbarExclude(action);
      if (!force) {
        return checkPermissionAction(action);
      }
      return !status;
    }
    return false;
  };
  const renderToolbar = () => {
    if (toolbar) {
      return (
        enableAction('view') ||
        enableAction('save-to-excel') ||
        enableAction('copy-to-clipboard') ||
        enableAction('edit') ||
        enableAction('delete') ||
        enableAction('add') ||
        enableAction('show-hide-column')
      );
    }
    return false;
  };

  const deleteData = () => {
    Promise.allSettled(
      selectedFlatRows.map(d => {
        return new Promise((resolve, reject) => {
          api
            .delete(d.original[identifierProperties])
            .then(r => resolve(r))
            .catch(e => reject(e));
        });
      })
    )
      .then(res => {
        const success = [];
        const failed = [];
        res.forEach(result => {
          if (result.status === 'fulfilled') {
            success.push(true);
            setLoadingHover(false);
          } else {
            result.reason.data.error.api.map(m => failed.push(m));
            failed.push(true);
            setLoadingHover(false);
          }
        });

        if (failed.length > 0) {
          Swal.fire({ text: 'There is some problem occured', icon: 'error' });
        } else {
          Swal.fire({ text: 'Data Deleted Successfully', icon: 'success' });
        }
        setFilterData(prev => ({
          ...prev,
          offset: 0,
        }));
      })
      .catch(error => {
        Swal.fire({ text: error?.message || 'Something Went Wrong', icon: 'error' });
      });
  };

  const download = () => {
    setLoadingHover(true);
    const wb = XLSX.utils.table_to_book(document.getElementById('mytable'), {
      sheet: `${displayName}`,
    });
    const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
    function s2ab(data) {
      const buf = new ArrayBuffer(data.length);
      const view = new Uint8Array(buf);
      // eslint-disable-next-line no-bitwise, no-plusplus
      for (let i = 0; i < data.length; i++) view[i] = data.charCodeAt(i) & 0xff;
      return buf;
    }
    setTimeout(() => {
      setLoadingHover(false);
    }, 500);
    return saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), `${displayName}.xlsx`);
  };

  const onReset = () => {
    reset();
    setFilterData({
      limit: 10,
      offset: 0,
      ...defaultSort,
    });
  };
  const onSubmit = data => {
    // eslint-disable-next-line no-restricted-syntax
    for (const dt in data) {
      if (Object.hasOwnProperty.call(data, dt)) {
        if (!data[dt]) {
          delete data[dt];
        }
        if (data[dt] === 'All') {
          setFilterData({
            limit: 10,
            offset: 0,
            ...defaultSort,
          });
          delete data[dt];
        }
        if (data[dt] instanceof Date) {
          if (dt.toLowerCase().includes('to')) {
            data[dt] = Moment(data[dt]).endOf('day').format('YYYY-MM-DD');
          } else {
            data[dt] = Moment(data[dt]).startOf('day').format('YYYY-MM-DD');
          }
        } else {
          // eslint-disable-next-line no-unused-expressions
          data[dt];
        }
      }
    }
    setFilterData(prev => {
      return {
        ...prev,
        limit: 10,
        offset: 0,
        ...data,
      };
    });
  };

  const onSortChange = by => {
    setFilterData(prev => {
      return {
        ...prev,
        sort_order: by.sort_order,
      };
    });
  };

  return (
    <Fade in={filters.length > 0}>
      {download && (
        <div style={{ display: 'none' }}>
          <TableComponent
            id="mytable"
            data={data}
            columns={allColumns.filter(i => i.id !== 'selection' && i.isVisible === true)}
            keys={data.filter(i => i[columns.map(i => i.accessor)])}
            header={propsColumn.filter(i => i.value)}
          />
        </div>
      )}
      {filter && filter.length !== 0 && (
        <div className="">
          <div className="flex">
            <h1 className="font-bold text-xl">{displayName}</h1>
          </div>
          <div>
            <form>
              <div className="px-4">
                <div className="grid grid-cols-6 gap-4 mt-4">
                  {filter.map((item, idx) => {
                    if (item.type === 'date_picker') {
                      return (
                        <div className={item.col ? `col-span-${item.col}` : ''} key={`component${idx}`}>
                          <DatePicker
                            name={item.name}
                            label={item.label}
                            placeholder={item.placeholder}
                            register={register}
                            control={control}
                            errors={errors}
                          />
                        </div>
                      );
                    }
                    if (item.type === 'select') {
                      return (
                        <div className={item.col ? `col-span-${item.col}` : ''} key={`component${idx}`}>
                          <Select
                            name={item.name}
                            label={item.label}
                            placeholder={item.label}
                            options={item.data}
                            register={register}
                            control={control}
                            errors={errors}
                            disabled={item.disabled}
                          />
                        </div>
                      );
                      // eslint-disable-next-line no-else-return
                    } else {
                      return (
                        <div className={item.col ? `col-span-${item.col}` : ''} key={`component${idx}`}>
                          <Input
                            name={item.name}
                            label={item.label}
                            maxLength={item.max}
                            register={register}
                            control={control}
                          />
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
              <div className="col-md-3 offset-md-9 px-0">
                <div className="flex justify-end mt-3 px-4 py-3">
                  <Button
                    _hover={{
                      shadow: 'md',
                      transform: 'translateY(-5px)',
                      transitionDuration: '0.2s',
                      transitionTimingFunction: 'ease-in-out',
                    }}
                    type="button"
                    size="sm"
                    px={8}
                    className="rounded-full border border-primarydeepo bg-[#fff] hover:bg-[#E4E4E4] text-[#184D47] font-bold"
                    onClick={() => onReset()}
                  >
                    Reset
                  </Button>
                  <Button
                    _hover={{
                      shadow: 'md',
                      transform: 'translateY(-5px)',
                      transitionDuration: '0.2s',
                      transitionTimingFunction: 'ease-in-out',
                    }}
                    type="submit"
                    size="sm"
                    px={8}
                    className="ml-4 rounded-full bg-primarydeepo drop-shadow-md text-[#fff] hover:text-[#E4E4E4] font-bold"
                    onClick={handleSubmit(onSubmit)}
                  >
                    Filter
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {renderToolbar() && filter.length !== 0 && (
        <Toolbar
          selectedData={selectedFlatRows}
          defaultShow={propsColumn}
          getToggleHideAllColumnsProps={getToggleHideAllColumnsProps}
          columns={allColumns}
          navTo={{ path: to, id: selectedFlatRows?.find(i => i)?.original.id }}
          displayName={displayName}
          name={name}
          onAdd={enableAction('add')}
          onEdit={enableAction('edit')}
          copyItem={allColumns.filter(i => i.id !== 'selection' && i.isVisible === true)}
          copyClipboard={enableAction('copy-to-clipboard')}
          view={enableAction('view')}
          onDelete={enableAction('delete') && deleteData}
          onDownload={enableAction('save-to-excel') && download}
          onShowHideColumn={enableAction('show-hide-column')}
        />
      )}
      {loadingHover && <LoadingHover text="Please Wait..." />}
      {filter.length !== 0 && (
        <div className="overflow-x-hidden relative px-6 pb-11 bg-white drop-shadow-md rounded-b-3xl">
          <div
            className={`${
              !loading && data.length <= 0 ? 'overflow-hide' : 'overflow-x-auto'
            } w-full bg-white no-scrollbar::-webkit-scrollbar no-scrollbar`}
          >
            <div className="scrollbar-x-auto">
              <table
                {...getTableProps()}
                className="table-auto w-full text-sm text-left border border-gray-200 text-gray-500 border-t"
              >
                <thead className="text-xs text-black uppercase bg-thead">
                  {headerGroups.map((headerGroup, idxgroup) => (
                    <tr key={idxgroup} {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column, columnidx) => {
                        return (
                          <th
                            key={columnidx}
                            {...column.getHeaderProps(column.getSortByToggleProps())}
                            className={`${columnidx === 0 ? 'px-6' : 'px-3'} py-3 `}
                            width={column.width === 'auto' ? autoWidth : ''}
                          >
                            <div
                              className="flex"
                              onClick={() => {
                                onSortChange({
                                  sort_order: column.isSorted ? (column.isSortedDesc ? 'desc' : 'asc') : 'desc',
                                });
                              }}
                            >
                              {column.render('Header')}
                              {column.isSorted ? (
                                <span className="ml-2">
                                  {column.isSortedDesc === true ? (
                                    <ArrowSmDownIcon className="ml-2 h-4" />
                                  ) : (
                                    <ArrowSmUpIcon className="ml-2 h-4" />
                                  )}
                                </span>
                              ) : (
                                ' '
                              )}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  ))}
                </thead>

                {!loading && (
                  <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                      prepareRow(row);
                      return (
                        <tr
                          key={i}
                          {...row.getRowProps()}
                          className={`${
                            i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          } border border-gray-200 hover:bg-slate-100`}
                        >
                          {row.cells.map((cell, idx) => (
                            <td key={idx} {...cell.getCellProps()} className="py-2 px-6">
                              {cell.render('Cell')}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                )}
              </table>

              {loading && (
                <Stack>
                  <div className="flex p-3 gap-2">
                    <Skeleton height="20px" width="5%" />
                    <Skeleton height="20px" width="95%" />
                  </div>
                  <div className="flex p-3 gap-2">
                    <Skeleton height="20px" width="5%" />
                    <Skeleton height="20px" width="95%" />
                  </div>
                  <div className="flex p-3 gap-2">
                    <Skeleton height="20px" width="5%" />
                    <Skeleton height="20px" width="95%" />
                  </div>
                  <div className="flex p-3 gap-2">
                    <Skeleton height="20px" width="5%" />
                    <Skeleton height="20px" width="95%" />
                  </div>
                </Stack>
              )}
            </div>
          </div>

          <nav className="flex justify-between items-center bg-white pl-4" aria-label="Table navigation">
            <span className="text-sm font-normal text-gray-500 ">
              {totalData <= 0 ? null : (
                <>
                  Showing <span className="font-semibold text-gray-900 ">{`${limit * (pages - 1) + 1} - `}</span>
                  <span className="font-semibold text-gray-900">
                    {pages * limit > totalData ? totalData : pages * limit}
                  </span>{' '}
                  of <span className="font-semibold text-gray-900 ">{totalData}</span>
                </>
              )}
            </span>
            <ul className="inline-flex items-center text-sm -space-x-px py-4">
              <li>
                <button
                  type="button"
                  disabled={pages === 1}
                  onClick={() => (pages === 1 ? {} : changePage(pages - 1))}
                  className="block py-2 px-3 ml-0 leading-tight text-gray-500 bg-white disabled:text-gray-300 disabled:hover:bg-white hover:bg-gray-100 hover:text-gray-700"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
              </li>
              {lastPage > 7 && pages >= 4 && (
                <>
                  <li>
                    <button
                      type="button"
                      onClick={() => changePage(1)}
                      className="py-2 px-3 leading-tight text-black rounded-lg bg-gray-100 mr-1  hover:bg-gray-700 hover:text-white"
                    >
                      1
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="py-2 px-3 leading-tight text-black rounded-lg mr-0.5 bg-gray-100 hover:bg-gray-700 hover:text-white"
                    >
                      ...
                    </button>
                  </li>
                </>
              )}
              {Array(
                lastPage > 7 && lastPage - pages < 3 ? 5 : lastPage > 7 && pages >= 4 ? 3 : lastPage > 7 ? 5 : lastPage
              )
                .fill('')
                .map((_, i) => {
                  const p =
                    lastPage > 7 && lastPage - pages < 3 ? lastPage - 4 : lastPage > 7 && pages >= 4 ? pages - 1 : 1;
                  return (
                    <li key={i}>
                      <button
                        type="button"
                        disabled={pages === i + p}
                        onClick={() => changePage(i + p)}
                        className={`${
                          pages === i + p ? 'bg-secondarydeepo text-white' : 'bg-[#F3F3F3]'
                        } py-2 px-3 mx-0.5 leading-tight text-black bg-gray-100 rounded-lg hover:bg-[#184D47] hover:text-white disabled:text-white`}
                      >
                        {i + p}
                      </button>
                    </li>
                  );
                })}
              {lastPage > 7 && lastPage - pages >= 3 && (
                <>
                  <li>
                    <button
                      type="button"
                      className="py-2 px-3 mr-1 ml-0.5 leading-tight text-black rounded-lg bg-gray-100 hover:bg-gray-700 hover:text-white"
                    >
                      ...
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => changePage(lastPage)}
                      className="py-2 px-3 leading-tight text-black rounded-lg bg-gray-100 hover:bg-gray-700 hover:text-white"
                    >
                      {lastPage}
                    </button>
                  </li>
                </>
              )}
              <li>
                <button
                  type="button"
                  disabled={pages === lastPage}
                  onClick={() => (pages === lastPage ? {} : changePage(pages + 1))}
                  className="block py-2 px-3 leading-tight text-gray-500 bg-white disabled:text-gray-300 disabled:hover:bg-white hover:bg-gray-100 hover:text-gray-700"
                >
                  <span className="sr-only">Next</span>
                  {totalData <= 0 ? null : <ChevronRightIcon className="w-5 h-5" />}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </Fade>
  );
}

export default observer(DataTable);
