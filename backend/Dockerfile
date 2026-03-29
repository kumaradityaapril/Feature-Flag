FROM golang:1.23-alpine AS builder

WORKDIR /app

# Download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source and build
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o feature-flag-api ./cmd/main.go

# Final stage
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/feature-flag-api .

# Setting up defaults, but docker-compose takes priority
EXPOSE 8080
CMD ["./feature-flag-api"]
