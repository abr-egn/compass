interface Query {
  _id: string;
  _name: string;
  _ns: string;
  _dateSaved: number;
  collation?: Record<string, unknown>;
  filter?: Record<string, unknown>;
  limit?: number;
  project?: Record<string, unknown>;
  skip?: number;
  sort?: Record<string, number>;
}

interface Aggregation {
  id: string;
  name: string;
  namespace: string;
  lastModified: number;
  autoPreview?: boolean;
  collation?: string;
  collationString?: string;
  comments?: boolean;
  env?: string;
  isReadonly?: boolean;
  isTimeSeries?: boolean;
  pipeline: Pipeline[];
  sample?: boolean;
  sourceName?: string;
}

interface Pipeline {
  id: string;
  stageOperator: string;
  stage: string;
  isValid: boolean;
  isEnabled: boolean;
  isExpanded: boolean;
  isLoading: boolean;
  isComplete: boolean;
  previewDocuments: unknown[];
  syntaxError: unknown;
  error: unknown;
  projections?: unknown[];
  fromStageOperators?: boolean;
  executor?: unknown;
  isMissingAtlasOnlyStageSupport?: boolean;
  snippet?: string;
}

declare module '@mongodb-js/compass-query-history' {
  class FavoriteQueryStorage {
    loadAll(): Promise<Query[]>;
    delete(id: string): Promise<void>;
  }

  export { Query, FavoriteQueryStorage };
}
declare module '@mongodb-js/compass-aggregations' {
  class PipelineStorage {
    loadAll(): Promise<Aggregation[]>;
    delete(id: string): Promise<void>;
  }

  export { Aggregation, PipelineStorage };
}
