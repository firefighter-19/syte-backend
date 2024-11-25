import React, { useEffect } from "react";
import { Button, Form, Input, Select, Segmented } from "antd";
import Checkbox from "antd/es/checkbox/Checkbox";
import { useLanguagesQuery } from "../../../shared/api/locale/locale";
import {
  useCreateCatalogMutation,
  useUpdateCatalogMutation,
} from "../../../shared/api/category/category";
import { CatalogCreateRequest } from "../../../shared/api/category/catalog.request";
import { useLocation, useNavigate, useSearchParams } from "react-router";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

export const CatalogCreate: React.FC = () => {
  const { data, isLoading, isError } = useLanguagesQuery();

  const location = useLocation();

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const [formSubmit, { data: createdData }] = useCreateCatalogMutation();
  const [formUpdate, { data: updatedData }] = useUpdateCatalogMutation();

  function checkAndCreate(
    form: Omit<CatalogCreateRequest, "user_id">,
    user_id: string,
    catalog_id?: string,
  ): void {
    const sendForm = { ...form };
    if (!sendForm.locales_ids.length) {
      sendForm["locales_ids"] = data!.map((locale) => locale.id);
    }
    const submitForm = {
      name: form.name,
      is_primary: form.is_primary,
      locales_ids: form.locales_ids,
      vertical: form.vertical.toLowerCase(),
      user_id,
    };
    if (catalog_id) {
      formUpdate({ ...submitForm, catalog_id });
    } else {
      formSubmit(submitForm);
    }
  }

  const [form] = Form.useForm();

  if (location?.state) {
    form.setFieldsValue({
      name: location?.state.name,
      is_primary: location?.state.is_primary,
      vertical: location?.state.vertical,
      locales_ids: location?.state.locales_ids,
    });
  }

  useEffect(() => {
    if (createdData || updatedData) {
      navigate(`/catalog?user_id=${searchParams.get("user_id")}`);
    }
  }, [createdData, updatedData]);

  const variant = Form.useWatch("variant", form);
  return (
    <>
      {!isLoading && isError ? <div>Something went wrong</div> : null}
      {isLoading ? (
        <div>Languages are loading...</div>
      ) : (
        <Form
          {...formItemLayout}
          form={form}
          variant={variant || "filled"}
          style={{ maxWidth: 600 }}
          initialValues={{ variant: "filled" }}
        >
          <Form.Item label="Form variant" name="vertical">
            <Segmented options={["Fashion", "Home", "General"]} />
          </Form.Item>

          <Form.Item
            label="Catalog name"
            name="name"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Is primary?"
            name="is_primary"
            valuePropName="checked"
          >
            <Checkbox></Checkbox>
          </Form.Item>

          <Form.Item label="Select" name="locales_ids" required>
            <Select mode="multiple">
              {data?.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.language}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() =>
                checkAndCreate(
                  form.getFieldsValue(),
                  searchParams.get("user_id") || "",
                  location?.state?.id,
                )
              }
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
};
