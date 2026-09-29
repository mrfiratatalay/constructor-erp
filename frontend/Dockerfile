# Arayüz imajı. Derleme bağlamı depo kökü: bkz. docker-compose.yml.
#
# Vite çıktısı statik dosyalardır; nginx hem onları sunar hem /api'yi backend'e geçirir. Böylece arayüz ve
# API aynı adreste görünür: oturum çerezi SameSite=Strict olduğu için bu şart.
FROM node:24-alpine AS build
WORKDIR /build

# Önce yalnızca bağımlılık tanımları: kaynak değişince paketler yeniden indirilmez (katman önbelleği).
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
# "Patron olarak doldur" düğmesinin hesabı docker-compose.yml'den gelir; verilmezse boş kalır, düğme çıkmaz.
ARG VITE_DEV_LOGIN_EMAIL=""
ARG VITE_DEV_LOGIN_PASSWORD=""
# Tanıtım sitesindeki satış telefonu ve e-postası; verilmezse site yalnızca başvuru formunu gösterir.
ARG VITE_SALES_PHONE=""
ARG VITE_SALES_EMAIL=""
RUN npm run build-only

FROM nginx:alpine AS runtime
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /build/dist /usr/share/nginx/html
EXPOSE 80
