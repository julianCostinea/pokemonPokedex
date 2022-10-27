import { render, RenderOptions, screen, waitForElementToBeRemoved } from "@testing-library/react";
import React, { FC, ReactElement } from "react";
import { CarBrands } from "./CarBrands";
import { MySwrConfig } from "../MySwrConfig";
import { setupServer } from "msw/node";
import { DefaultBodyType, PathParams, rest } from "msw";

const server = setupServer(
  rest.get<DefaultBodyType, PathParams, string[]>("/api/cars/france", (req, res, ctx) => {
    return res(ctx.delay(100), ctx.json([`Custom France B1`, `Custom France B2`]));
  }),

  rest.get<DefaultBodyType, PathParams, string[]>("/api/cars/germany", (req, res, ctx) => {
    return res(ctx.delay(100), ctx.json([`Custom Germany B1`, `Custom Germany B2`]));
  }),

  rest.get<DefaultBodyType, PathParams, { message: string }>("/api/cars/italy", (req, res, ctx) => {
    return res(ctx.delay(100), ctx.status(500), ctx.json({ message: "Unit test message" }));
  })

  // rest.get<DefaultBodyType, {country: string}, string[]>(
  //   '/api/cars/:country',
  //   (req, res, ctx) => {
  //     return res(
  //       ctx.delay(100),
  //       ctx.json([`${req.params.country} xB1`, `${req.params.country} B2`])
  //     );
  //   }
  // )
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe("Car Brands", () => {
  describe('when "France" is selected', () => {
    beforeEach(async () => {
      render(
        <MySwrConfig>
          <CarBrands country="France" />
        </MySwrConfig>
      );
      await waitForElementToBeRemoved(() => screen.getByText("Loading..."));
    });

    it('renders "Car Brands from France"', () => {
      const element = screen.getByText("Car Brands from France");
      expect(element).toBeInTheDocument();
    });
    it("renders the expected brands", () => {
      expect(screen.getByText("Custom France B1")).toBeInTheDocument();
      expect(screen.getByText("Custom France B2")).toBeInTheDocument();
    });
  });

  describe('when "Germany" is selected', () => {
    beforeEach(async () => {
      render(
        <MySwrConfig>
          <CarBrands country="Germany" />
        </MySwrConfig>
      );
      await waitForElementToBeRemoved(() => screen.getByText("Loading..."));
    });

    it('renders "Car Brands from Germany"', () => {
      const element = screen.getByText("Car Brands from Germany");
      expect(element).toBeInTheDocument();
    });
    it("renders the expected brands", () => {
      expect(screen.getByText("Custom Germany B1")).toBeInTheDocument();
      expect(screen.getByText("Custom Germany B2")).toBeInTheDocument();
    });
  });

  describe('when "Italy" is selected', () => {
    beforeEach(async () => {
      render(
        <MySwrConfig>
          <CarBrands country="Italy" />
        </MySwrConfig>
      );
      await waitForElementToBeRemoved(() => screen.getByText("Loading..."));
    });

    it('renders "Car Brands from Italy"', () => {
      const element = screen.getByText("Car Brands from Italy");
      expect(element).toBeInTheDocument();
    });
    it("show expected error message", () => {
      expect(screen.getByText("Unit test message")).toBeInTheDocument();
    });
  });

  describe("when no results returned", () => {
    beforeEach(async () => {
      server.use(
        rest.get<DefaultBodyType, PathParams, string[]>("/api/cars/france", (req, res, ctx) => {
          return res(ctx.delay(100), ctx.json([]));
        })
      );

      render(
        <MySwrConfig>
          <CarBrands country="France" />
        </MySwrConfig>
      );
      await waitForElementToBeRemoved(() => screen.getByText("Loading..."));
    });

    it("show expected no data message", () => {
      expect(screen.getByText("No Data to Show")).toBeInTheDocument();
    });
  });
});

const AllTheProviders: FC = ({ children }) => {
  return <MySwrConfig swrConfig={{ dedupingInterval: 0, provider: () => new Map() }}>{children}</MySwrConfig>;
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options });
