import React from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Badge,
  Chip,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Coffee, 
  LocalCafe,
  EmojiFoodBeverage,
  LocalBar,
  Fastfood,
  Category as CategoryIcon
} from '@mui/icons-material';
import { Category } from '@/types/product';

interface ProductCategoriesProps {
  categories: Category[];
  currentTab: string;
  onTabChange: (value: string) => void;
  productCounts?: Record<string, number>;
}

const categoryIcons = {
  coffee: Coffee,
  tea: EmojiFoodBeverage,
  milktea: LocalCafe,
  smoothie: LocalBar,
  default: Fastfood
};

const ProductCategories: React.FC<ProductCategoriesProps> = ({
  categories,
  currentTab,
  onTabChange,
  productCounts = {}
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    onTabChange(newValue);
  };

  const getCategoryIcon = (categoryId: string) => {
    const IconComponent = categoryIcons[categoryId as keyof typeof categoryIcons] || categoryIcons.default;
    return <IconComponent />;
  };

  const renderBadge = (count: number) => {
    if (!count) return null;
    return (
      <Chip
        size="small"
        label={count}
        color="primary"
        className="ml-2"
      />
    );
  };

  return (
    <Box className="mb-6">
      <Box className="border-b border-gray-200">
        <Tabs
          value={currentTab}
          onChange={handleChange}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
          allowScrollButtonsMobile
          className="min-h-[48px]"
        >
          <Tab
            value="all"
            label={
              <Box className="flex items-center">
                <CategoryIcon className="mr-2" />
                <span>Tất cả</span>
                {renderBadge(
                  Object.values(productCounts).reduce((a, b) => a + b, 0)
                )}
              </Box>
            }
            className="min-h-[48px]"
          />
          
          {categories
            .filter(category => category.isActive)
            .map((category) => (
              <Tab
                key={category.id}
                value={category.id}
                label={
                  <Box className="flex items-center">
                    {getCategoryIcon(category.id)}
                    <span className="mx-2">{category.name}</span>
                    {renderBadge(productCounts[category.id] || 0)}
                  </Box>
                }
                className="min-h-[48px]"
              />
            ))}
        </Tabs>
      </Box>

      {/* Category Description */}
      {currentTab !== 'all' && (
        <Box className="mt-4 px-4">
          <Typography 
            variant="body2" 
            color="text.secondary"
            className="flex items-center"
          >
            {getCategoryIcon(currentTab)}
            <span className="ml-2">
              {categories.find(c => c.id === currentTab)?.description || 
               'Danh mục sản phẩm'}
            </span>
          </Typography>
        </Box>
      )}

      {/* Category Stats */}
      <Box className="mt-4 flex flex-wrap gap-4">
        {currentTab === 'all' ? (
          <Box className="flex flex-wrap gap-4">
            {categories
              .filter(category => category.isActive)
              .map((category) => (
                <Chip
                  key={category.id}
                  icon={getCategoryIcon(category.id)}
                  label={`${category.name}: ${productCounts[category.id] || 0}`}
                  variant="outlined"
                  onClick={() => onTabChange(category.id)}
                  className="cursor-pointer"
                />
              ))}
          </Box>
        ) : (
          <Chip
            icon={getCategoryIcon(currentTab)}
            label={`Tổng số: ${productCounts[currentTab] || 0} sản phẩm`}
            color="primary"
            variant="outlined"
          />
        )}
      </Box>
    </Box>
  );
};

export default ProductCategories;
