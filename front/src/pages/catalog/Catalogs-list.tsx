import { FC, useEffect, useState } from "react";
import { Button, Tabs } from "antd";
import type { TabsProps } from "antd";
import {
  useCatalogQuery,
  useDeleteCatalogManyMutation,
  useDeleteCatalogMutation,
} from "../../shared/api/category/category";
import { CatalogResponse } from "../../shared/api/category/catalog.response";
import { NavLink, useSearchParams } from "react-router";
import { CatalogTableList } from "./catalogTable/Catalog-table";

const onChange = (key: string) => {
  console.log(key);
};

export interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

export const CatalogsList: FC = () => {
  const [searchParams] = useSearchParams();

  const [tabs, setTabs] = useState<CatalogResponse>({
    fashion: [],
    general: [],
    home: [],
  });

  const [catalogsToDelete, setCatalogsToDelete] = useState<string[]>([]);

  const { data, error, isLoading, refetch } = useCatalogQuery({
    user_id: searchParams.get("user_id") || "",
  });

  const handleDelete = (catalog_id: string) => {
    setCatalogsToDelete((prevState) => {
      if (prevState.includes(catalog_id)) {
        return prevState.filter((id) => id !== catalog_id);
      }
      return [...prevState, catalog_id];
    });
  };

  const [deleteCatalog, { data: response }] = useDeleteCatalogMutation();
  const [deleteCatalogMany, { data: respondedMany }] =
    useDeleteCatalogManyMutation();

  useEffect(() => {
    if (data) {
      setTabs((prevState) => {
        return {
          ...prevState,
          ...data,
        };
      });
    }
  }, [data]);

  useEffect(() => {
    if (response) {
      setTabs((prevState) => {
        return {
          ...prevState,
          ...response,
        };
      });
    }
  }, [response]);

  useEffect(() => {
    refetch();
  }, [refetch, searchParams, respondedMany]);

  return (
    <>
      {isLoading && !error && data === undefined
        ? "User is loaded, loading catalogs"
        : null}
      {data ? (
        <>
          <Tabs
            defaultActiveKey="1"
            items={convertToTabs(tabs, handleDelete, deleteCatalog)}
            onChange={onChange}
          />
          <NavLink to={`/create?user_id=${searchParams.get("user_id")}`}>
            Create table
          </NavLink>
          {catalogsToDelete.length ? (
            <Button
              onClick={() =>
                deleteCatalogMany({
                  catalog_ids: catalogsToDelete,
                  user_id: searchParams.get("user_id") || "",
                })
              }
            >
              DELETE ALL
            </Button>
          ) : null}
        </>
      ) : null}
      <div>{error ? "Sorry, something went wrong" : null}</div>
    </>
  );
};

function convertToTabs(
  data: CatalogResponse,
  handleDelete: (id: string) => void,
  deleteCatalog: ({
    user_id,
    catalog_id,
  }: {
    user_id: string;
    catalog_id: string;
  }) => void,
): TabsProps["items"] {
  return Object.keys(data).map((key) => {
    return {
      key: key,
      label: key,
      children: (
        <CatalogTableList
          deleteCatalog={deleteCatalog}
          handleDelete={handleDelete}
          data={data[key as keyof CatalogResponse]}
        ></CatalogTableList>
      ),
    };
  });
}
