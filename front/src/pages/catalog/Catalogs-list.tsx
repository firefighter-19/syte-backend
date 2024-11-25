import { FC, useEffect, useState } from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import {
  useCatalogQuery,
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

  const { data, error, isLoading, refetch } = useCatalogQuery({
    user_id: searchParams.get("user_id") || "",
  });

  const [deleteCatalog, { data: response }] = useDeleteCatalogMutation();

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
  }, [refetch, searchParams]);

  return (
    <>
      {isLoading && !error && data === undefined
        ? "User is loaded, loading catalogs"
        : null}
      {data ? (
        <>
          <Tabs
            defaultActiveKey="1"
            items={convertToTabs(tabs, deleteCatalog)}
            onChange={onChange}
          />
          <NavLink to={`/create?user_id=${searchParams.get("user_id")}`}>
            Create table
          </NavLink>
        </>
      ) : null}
      <div>{error ? "Sorry, something went wrong" : null}</div>
    </>
  );
};

function convertToTabs(
  data: CatalogResponse,
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
          data={data[key as keyof CatalogResponse]}
        ></CatalogTableList>
      ),
    };
  });
}
